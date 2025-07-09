import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Animal from '../models/Animal.js';
import User from '../models/User.js';

const router = express.Router();

// Get user's rescue listings
router.get('/rescues', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const rescues = await Animal.find({ posterId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('adopterId', 'name email');
    
    const total = await Animal.countDocuments({ posterId: req.user._id });
    
    res.json({
      rescues,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's adoptions
router.get('/adoptions', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const adoptions = await Animal.find({ 
      adopterId: req.user._id,
      status: 'adopted'
    })
      .sort({ adoptionDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('posterId', 'name email phone location');
    
    const total = await Animal.countDocuments({ 
      adopterId: req.user._id,
      status: 'adopted'
    });
    
    res.json({
      adoptions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard stats
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('stats');
    
    const rescues = await Animal.countDocuments({ posterId: req.user._id });
    const adoptions = await Animal.countDocuments({ 
      adopterId: req.user._id,
      status: 'adopted'
    });
    const pending = await Animal.countDocuments({ 
      posterId: req.user._id,
      status: 'available'
    });
    
    // Get recent activity
    const recentRescues = await Animal.find({ posterId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name type photos createdAt status');
    
    const recentAdoptions = await Animal.find({ 
      adopterId: req.user._id,
      status: 'adopted'
    })
      .sort({ adoptionDate: -1 })
      .limit(5)
      .select('name type photos adoptionDate')
      .populate('posterId', 'name location');
    
    res.json({
      stats: {
        rescues,
        adoptions,
        pending
      },
      recentActivity: {
        rescues: recentRescues,
        adoptions: recentAdoptions
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;