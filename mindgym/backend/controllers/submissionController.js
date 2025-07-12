import Submission from '../models/Submission.js';
import Problem from '../models/Problem.js';
import User from '../models/User.js';
import { validateSubmission } from '../utils/validation.js';
import { judgeSubmission } from '../services/judgeService.js';

export const submitCode = async (req, res) => {
  try {
    const { error } = validateSubmission(req.body);
    if (error) {
      return res.status(400).json({ 
        error: error.details[0].message 
      });
    }

    const { problemId, userCode, language = 'python' } = req.body;

    // Verify problem exists
    const problem = await Problem.findOne({ _id: problemId, isActive: true });
    if (!problem) {
      return res.status(404).json({ 
        error: 'Problem not found' 
      });
    }

    // Create submission
    const submission = new Submission({
      userId: req.user._id,
      problemId,
      code: userCode,
      language,
      totalTestCases: problem.testCases.length
    });

    await submission.save();

    // Update problem stats
    await Problem.findByIdAndUpdate(problemId, {
      $inc: { 'stats.totalSubmissions': 1 }
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.totalSubmissions': 1 }
    });

    // Start judging process (async)
    judgeSubmission(submission._id, problem, userCode)
      .catch(error => {
        console.error('Judge error:', error);
      });

    res.status(201).json({
      message: 'Submission created successfully',
      submissionId: submission._id,
      status: 'Pending'
    });
  } catch (error) {
    console.error('Submit code error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

export const getSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const submission = await Submission.findOne({
      _id: id,
      userId: req.user._id
    }).populate('problemId', 'title');

    if (!submission) {
      return res.status(404).json({ 
        error: 'Submission not found' 
      });
    }

    res.json({ submission });
  } catch (error) {
    console.error('Get submission status error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

export const getUserSubmissions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      problemId,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;
    const query = { userId: req.user._id };

    if (problemId) {
      query.problemId = problemId;
    }

    if (status) {
      query.status = status;
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const submissions = await Submission.find(query)
      .populate('problemId', 'title difficulty')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Submission.countDocuments(query);

    res.json({
      submissions,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get user submissions error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

export const getSubmissionCode = async (req, res) => {
  try {
    const { id } = req.params;
    
    const submission = await Submission.findOne({
      _id: id,
      $or: [
        { userId: req.user._id },
        { isPublic: true }
      ]
    }).populate('problemId', 'title');

    if (!submission) {
      return res.status(404).json({ 
        error: 'Submission not found' 
      });
    }

    res.json({ 
      submission: {
        _id: submission._id,
        code: submission.code,
        language: submission.language,
        status: submission.status,
        runtime: submission.runtime,
        memory: submission.memory,
        createdAt: submission.createdAt,
        problemId: submission.problemId
      }
    });
  } catch (error) {
    console.error('Get submission code error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

export const getSubmissionStats = async (req, res) => {
  try {
    const stats = await Submission.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentSubmissions = await Submission.find({ userId: req.user._id })
      .populate('problemId', 'title difficulty')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ 
      statusStats: stats,
      recentSubmissions
    });
  } catch (error) {
    console.error('Get submission stats error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};