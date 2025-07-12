import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ['python'],
    default: 'python'
  },
  status: {
    type: String,
    enum: [
      'Pending',
      'Accepted', 
      'Wrong Answer',
      'Time Limit Exceeded',
      'Memory Limit Exceeded',
      'Runtime Error',
      'Compilation Error',
      'Internal Error'
    ],
    default: 'Pending'
  },
  runtime: {
    type: Number, // in milliseconds
    default: 0
  },
  memory: {
    type: Number, // in MB
    default: 0
  },
  testCasesPassed: {
    type: Number,
    default: 0
  },
  totalTestCases: {
    type: Number,
    default: 0
  },
  errorMessage: String,
  executionDetails: {
    compilationTime: Number,
    executionTime: Number,
    peakMemory: Number,
    exitCode: Number
  },
  judgeData: {
    judgeId: String,
    judgeStartTime: Date,
    judgeEndTime: Date,
    containerLogs: String
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
submissionSchema.index({ userId: 1, createdAt: -1 });
submissionSchema.index({ problemId: 1, createdAt: -1 });
submissionSchema.index({ userId: 1, problemId: 1, createdAt: -1 });
submissionSchema.index({ status: 1, createdAt: -1 });

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;