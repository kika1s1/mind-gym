import Docker from 'dockerode';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Submission from '../models/Submission.js';
import Problem from '../models/Problem.js';
import User from '../models/User.js';

const docker = new Docker();

export const judgeSubmission = async (submissionId, problem, userCode) => {
  const submission = await Submission.findById(submissionId);
  if (!submission) {
    throw new Error('Submission not found');
  }

  const judgeId = uuidv4();
  const startTime = new Date();

  try {
    // Update submission status
    submission.status = 'Pending';
    submission.judgeData = {
      judgeId,
      judgeStartTime: startTime
    };
    await submission.save();

    // Create temporary directory for this submission
    const tempDir = `/tmp/judge_${judgeId}`;
    await fs.mkdir(tempDir, { recursive: true });

    // Write user code to file
    const codeFile = path.join(tempDir, 'solution.py');
    await fs.writeFile(codeFile, userCode);

    // Run test cases
    const results = await runTestCases(problem.testCases, userCode, tempDir, problem.timeLimit);

    // Update submission with results
    submission.status = results.status;
    submission.runtime = results.runtime;
    submission.memory = results.memory;
    submission.testCasesPassed = results.passedTests;
    submission.errorMessage = results.errorMessage;
    submission.executionDetails = results.executionDetails;
    submission.judgeData.judgeEndTime = new Date();

    await submission.save();

    // Update problem and user stats if accepted
    if (results.status === 'Accepted') {
      await Problem.findByIdAndUpdate(problem._id, {
        $inc: { 'stats.acceptedSubmissions': 1 }
      });

      await User.findByIdAndUpdate(submission.userId, {
        $inc: { 'stats.acceptedSubmissions': 1 },
        $addToSet: { solvedProblems: problem._id }
      });
    }

    // Clean up temporary files
    await fs.rm(tempDir, { recursive: true, force: true });

    return results;
  } catch (error) {
    console.error('Judge error:', error);
    
    // Update submission with error
    submission.status = 'Internal Error';
    submission.errorMessage = error.message;
    submission.judgeData.judgeEndTime = new Date();
    await submission.save();

    throw error;
  }
};

const runTestCases = async (testCases, userCode, tempDir, timeLimit) => {
  let passedTests = 0;
  let totalRuntime = 0;
  let maxMemory = 0;
  let errorMessage = '';

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    
    try {
      const result = await runSingleTestCase(testCase, userCode, tempDir, timeLimit);
      
      if (result.status === 'Accepted') {
        passedTests++;
        totalRuntime += result.runtime;
        maxMemory = Math.max(maxMemory, result.memory);
      } else {
        return {
          status: result.status,
          runtime: totalRuntime,
          memory: maxMemory,
          passedTests,
          errorMessage: result.errorMessage || `Failed on test case ${i + 1}`,
          executionDetails: result.executionDetails
        };
      }
    } catch (error) {
      return {
        status: 'Internal Error',
        runtime: totalRuntime,
        memory: maxMemory,
        passedTests,
        errorMessage: error.message,
        executionDetails: {}
      };
    }
  }

  return {
    status: 'Accepted',
    runtime: totalRuntime,
    memory: maxMemory,
    passedTests,
    errorMessage: '',
    executionDetails: {}
  };
};

const runSingleTestCase = async (testCase, userCode, tempDir, timeLimit) => {
  const startTime = Date.now();
  
  try {
    // Create input file
    const inputFile = path.join(tempDir, 'input.txt');
    await fs.writeFile(inputFile, testCase.input);

    // Create test runner script
    const testScript = `
import sys
import os
import time
import traceback
from io import StringIO

# Redirect stdout
old_stdout = sys.stdout
sys.stdout = StringIO()

try:
    # Import user solution
    exec(open('solution.py').read())
    
    # Read input
    with open('input.txt', 'r') as f:
        input_data = f.read().strip()
    
    # Execute solution (this is basic - would need problem-specific execution)
    # For now, assuming the solution defines a main function or prints output
    
    # Get output
    output = sys.stdout.getvalue().strip()
    
    # Write output
    with open('output.txt', 'w') as f:
        f.write(output)
        
except Exception as e:
    with open('error.txt', 'w') as f:
        f.write(str(e) + '\\n' + traceback.format_exc())
    sys.exit(1)
finally:
    sys.stdout = old_stdout
`;

    const testFile = path.join(tempDir, 'test.py');
    await fs.writeFile(testFile, testScript);

    // Run in Docker container
    const container = await docker.createContainer({
      Image: 'python:3.9-slim',
      Cmd: ['python', 'test.py'],
      WorkingDir: '/app',
      HostConfig: {
        Binds: [`${tempDir}:/app`],
        Memory: 256 * 1024 * 1024, // 256MB
        CpuQuota: 50000, // 50% CPU
        NetworkMode: 'none' // No network access
      },
      AttachStdout: true,
      AttachStderr: true
    });

    await container.start();

    // Wait for container with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Time Limit Exceeded')), timeLimit);
    });

    const containerPromise = container.wait();

    try {
      const result = await Promise.race([containerPromise, timeoutPromise]);
      
      if (result.StatusCode !== 0) {
        // Check for error file
        try {
          const errorContent = await fs.readFile(path.join(tempDir, 'error.txt'), 'utf8');
          return {
            status: 'Runtime Error',
            runtime: Date.now() - startTime,
            memory: 0,
            errorMessage: errorContent
          };
        } catch {
          return {
            status: 'Runtime Error',
            runtime: Date.now() - startTime,
            memory: 0,
            errorMessage: 'Unknown runtime error'
          };
        }
      }

      // Check output
      try {
        const actualOutput = await fs.readFile(path.join(tempDir, 'output.txt'), 'utf8');
        const expectedOutput = testCase.output.trim();
        
        if (actualOutput.trim() === expectedOutput) {
          return {
            status: 'Accepted',
            runtime: Date.now() - startTime,
            memory: 0 // Would need to implement memory tracking
          };
        } else {
          return {
            status: 'Wrong Answer',
            runtime: Date.now() - startTime,
            memory: 0,
            errorMessage: `Expected: ${expectedOutput}, Got: ${actualOutput.trim()}`
          };
        }
      } catch {
        return {
          status: 'Runtime Error',
          runtime: Date.now() - startTime,
          memory: 0,
          errorMessage: 'No output produced'
        };
      }
    } catch (error) {
      if (error.message === 'Time Limit Exceeded') {
        return {
          status: 'Time Limit Exceeded',
          runtime: timeLimit,
          memory: 0,
          errorMessage: 'Solution exceeded time limit'
        };
      }
      throw error;
    } finally {
      // Clean up container
      try {
        await container.remove({ force: true });
      } catch (error) {
        console.error('Error removing container:', error);
      }
    }
  } catch (error) {
    return {
      status: 'Internal Error',
      runtime: Date.now() - startTime,
      memory: 0,
      errorMessage: error.message
    };
  }
};