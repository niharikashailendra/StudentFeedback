// src/routes/admin.js - ENHANCED
const express = require('express');
const { Parser } = require('json2csv');
const User = require('../models/user');
const Feedback = require('../models/feedback');
const Course = require('../models/course');
const { authenticate, authorize } = require('../middlewares/auth');
const router = express.Router();

// List all students
router.get('/students', authenticate, authorize('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const query = { 
      role: 'student',
      ...(search && {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      })
    };

    const students = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page-1)*limit)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      students,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalStudents: total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Block/Unblock student
router.put('/students/:id/block', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { blocked } = req.body;
    const student = await User.findByIdAndUpdate(
      req.params.id, 
      { blocked }, 
      { new: true }
    ).select('-password');
    
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user
router.delete('/students/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    // Also delete user's feedback
    await Feedback.deleteMany({ student: req.params.id });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get feedback analytics
router.get('/feedback-stats', authenticate, authorize('admin'), async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
      {
        $group: { 
          _id: '$course', 
          avgRating: { $avg: '$rating' }, 
          count: { $sum: 1 } 
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course'
        }
      },
      {
        $unwind: '$course'
      },
      {
        $project: {
          courseName: '$course.title',
          courseCode: '$course.code',
          avgRating: { $round: ['$avgRating', 2] },
          feedbackCount: '$count'
        }
      }
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Export feedback to CSV
router.get('/export-feedback', authenticate, authorize('admin'), async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('student', 'name email')
      .populate('course', 'title code')
      .sort({ createdAt: -1 });

    const fields = [
      { label: 'Student Name', value: 'student.name' },
      { label: 'Student Email', value: 'student.email' },
      { label: 'Course', value: 'course.title' },
      { label: 'Course Code', value: 'course.code' },
      { label: 'Rating', value: 'rating' },
      { label: 'Message', value: 'message' },
      { label: 'Date', value: 'createdAt' }
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(feedbacks);

    res.header('Content-Type', 'text/csv');
    res.attachment('feedback-export.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get dashboard stats
router.get('/dashboard-stats', authenticate, authorize('admin'), async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFeedback = await Feedback.countDocuments();
    const totalCourses = await Course.countDocuments();
    const blockedStudents = await User.countDocuments({ role: 'student', blocked: true });

    res.json({
      totalStudents,
      totalFeedback,
      totalCourses,
      blockedStudents
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/analytics/feedback-trend', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const trendData = await Feedback.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);

    res.json(trendData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get rating distribution
router.get('/analytics/rating-distribution', authenticate, authorize('admin'), async (req, res) => {
  try {
    const distribution = await Feedback.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json(distribution);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;