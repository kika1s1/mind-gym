import Problem from '../models/Problem.js';
import { validateProblem } from '../utils/validation.js';

export const getProblems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      difficulty,
      category,
      tags,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;
    const query = { isActive: true };

    // Build filters
    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (category) {
      query.category = category;
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const problems = await Problem.find(query)
      .select('-testCases -solution') // Hide test cases and solution from list
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'username');

    const total = await Problem.countDocuments(query);

    res.json({
      problems,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

export const getProblem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const problem = await Problem.findOne({ 
      _id: id, 
      isActive: true 
    })
    .select('-testCases -solution') // Hide test cases and solution
    .populate('createdBy', 'username');

    if (!problem) {
      return res.status(404).json({ 
        error: 'Problem not found' 
      });
    }

    res.json({ problem });
  } catch (error) {
    console.error('Get problem error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

export const createProblem = async (req, res) => {
  try {
    const { error } = validateProblem(req.body);
    if (error) {
      return res.status(400).json({ 
        error: error.details[0].message 
      });
    }

    const problem = new Problem({
      ...req.body,
      createdBy: req.user._id
    });

    await problem.save();

    res.status(201).json({
      message: 'Problem created successfully',
      problem
    });
  } catch (error) {
    console.error('Create problem error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

export const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = validateProblem(req.body);
    
    if (error) {
      return res.status(400).json({ 
        error: error.details[0].message 
      });
    }

    const problem = await Problem.findOneAndUpdate(
      { _id: id, isActive: true },
      req.body,
      { new: true }
    );

    if (!problem) {
      return res.status(404).json({ 
        error: 'Problem not found' 
      });
    }

    res.json({
      message: 'Problem updated successfully',
      problem
    });
  } catch (error) {
    console.error('Update problem error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

export const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const problem = await Problem.findOneAndUpdate(
      { _id: id, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!problem) {
      return res.status(404).json({ 
        error: 'Problem not found' 
      });
    }

    res.json({
      message: 'Problem deleted successfully'
    });
  } catch (error) {
    console.error('Delete problem error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

export const getProblemStats = async (req, res) => {
  try {
    const stats = await Problem.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 }
        }
      }
    ]);

    const categories = await Problem.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ 
      difficultyStats: stats,
      categoryStats: categories
    });
  } catch (error) {
    console.error('Get problem stats error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};