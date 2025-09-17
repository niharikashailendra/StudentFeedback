// src/routes/feedback.js - UPDATED
const express = require('express');
const Feedback = require('../models/feedback');
const { authenticate } = require('../middlewares/auth');
const router = express.Router();

// Create feedback
router.post('/', authenticate, async (req, res) => {
  try {
    const fb = new Feedback({
      student: req.user._id,
      course: req.body.course,
      rating: req.body.rating,
      message: req.body.message
    });
    await fb.save();
    await fb.populate('course', 'title code'); // Populate course details
    res.status(201).json(fb);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my feedbacks with pagination
router.get('/my', authenticate, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  try {
    const feedbacks = await Feedback.find({ student: req.user._id })
      .populate('course', 'title code')
      .sort({ createdAt: -1 })
      .skip((page-1)*limit)
      .limit(limit);

    const total = await Feedback.countDocuments({ student: req.user._id });
    
    res.json({
      feedbacks,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalFeedbacks: total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update feedback (own feedback only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const feedback = await Feedback.findOne({ 
      _id: req.params.id, 
      student: req.user._id 
    });
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    feedback.rating = req.body.rating;
    feedback.message = req.body.message;
    await feedback.save();
    await feedback.populate('course', 'title code');
    
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete feedback (own feedback only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const feedback = await Feedback.findOneAndDelete({ 
      _id: req.params.id, 
      student: req.user._id 
    });
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;