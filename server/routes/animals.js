import express from 'express';
import multer from 'multer';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import Animal from '../models/Animal.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/email.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Get all animals with filtering
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { type, status, location, urgent, needsFoster, page = 1, limit = 12 } = req.query;
    
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (urgent === 'true') filter.urgent = true;
    if (needsFoster === 'true') filter.needsFoster = true;
    
    const skip = (page - 1) * limit;
    
    const animals = await Animal.find(filter)
      .populate('posterId', 'name email phone location')
      .sort({ urgent: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Animal.countDocuments(filter);
    
    res.json({
      animals,
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

// Get animal by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id)
      .populate('posterId', 'name email phone location')
      .populate('adopterId', 'name email');
    
    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    
    res.json(animal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new animal listing
router.post('/', authenticateToken, upload.array('photos', 5), async (req, res) => {
  try {
    const {
      type,
      name,
      breed,
      age,
      gender,
      size,
      color,
      description,
      specialNotes,
      location,
      currentLocation,
      urgent,
      needsFoster,
      medicalNeeds
    } = req.body;

    const photos = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    if (photos.length === 0) {
      return res.status(400).json({ error: 'At least one photo is required' });
    }

    const locationData = typeof location === 'string' ? JSON.parse(location) : location;

    const animal = new Animal({
      type,
      name,
      breed,
      age,
      gender,
      size,
      color,
      description,
      specialNotes,
      photos,
      location: locationData,
      currentLocation,
      urgent: urgent === 'true',
      needsFoster: needsFoster === 'true',
      medicalNeeds,
      posterId: req.user._id
    });

    await animal.save();
    
    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.animalsRescued': 1 }
    });

    // Send confirmation email
    await sendEmail(
      req.user.email,
      'Animal Listing Created - Stray2Stay',
      `Hi ${req.user.name},\n\nYour animal listing has been created successfully! Thank you for helping a stray find a home.\n\nBest regards,\nStray2Stay Team`
    );

    res.status(201).json({
      message: 'Animal listed successfully',
      animal: await Animal.findById(animal._id).populate('posterId', 'name email phone location')
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update animal listing
router.put('/:id', authenticateToken, upload.array('photos', 5), async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    
    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    
    if (animal.posterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this listing' });
    }

    const updateData = { ...req.body };
    
    // Handle location data
    if (updateData.location && typeof updateData.location === 'string') {
      updateData.location = JSON.parse(updateData.location);
    }
    
    // Handle boolean fields
    if (updateData.urgent !== undefined) updateData.urgent = updateData.urgent === 'true';
    if (updateData.needsFoster !== undefined) updateData.needsFoster = updateData.needsFoster === 'true';
    
    // Handle new photos
    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map(file => `/uploads/${file.filename}`);
      updateData.photos = [...animal.photos, ...newPhotos];
    }

    const updatedAnimal = await Animal.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('posterId', 'name email phone location');

    res.json({
      message: 'Animal updated successfully',
      animal: updatedAnimal
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete animal listing
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    
    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    
    if (animal.posterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }

    await Animal.findByIdAndDelete(req.params.id);
    
    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.animalsRescued': -1 }
    });

    res.json({ message: 'Animal listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Express interest in adopting
router.post('/:id/interest', authenticateToken, async (req, res) => {
  try {
    const { message, contactInfo } = req.body;
    const animal = await Animal.findById(req.params.id).populate('posterId', 'name email notificationPreferences');
    
    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    
    if (animal.status === 'adopted') {
      return res.status(400).json({ error: 'Animal has already been adopted' });
    }
    
    if (animal.posterId._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot express interest in your own listing' });
    }

    // Check if user already expressed interest
    const existingInterest = animal.interestedUsers.find(
      interest => interest.user.toString() === req.user._id.toString()
    );
    
    if (existingInterest) {
      return res.status(400).json({ error: 'You have already expressed interest in this animal' });
    }

    animal.interestedUsers.push({
      user: req.user._id,
      message,
      contactInfo,
      timestamp: new Date()
    });

    await animal.save();

    // Send email notification to poster
    if (animal.posterId.notificationPreferences.adoptionInterest) {
      await sendEmail(
        animal.posterId.email,
        'Someone is interested in adopting your rescued animal!',
        `Hi ${animal.posterId.name},\n\nSomeone is interested in adopting ${animal.name || 'the ' + animal.type}!\n\nInterested person: ${req.user.name}\nContact: ${contactInfo}\nMessage: ${message}\n\nPlease contact them to arrange the adoption.\n\nBest regards,\nStray2Stay Team`
      );
    }

    res.json({ message: 'Interest expressed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark animal as adopted
router.patch('/:id/adopt', authenticateToken, async (req, res) => {
  try {
    const { adopterId } = req.body;
    const animal = await Animal.findById(req.params.id).populate('posterId', 'name email notificationPreferences');
    
    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    
    if (animal.posterId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this listing' });
    }

    const adopter = await User.findById(adopterId);
    if (!adopter) {
      return res.status(404).json({ error: 'Adopter not found' });
    }

    animal.status = 'adopted';
    animal.adopterId = adopterId;
    animal.adoptionDate = new Date();
    
    await animal.save();

    // Update adopter stats
    await User.findByIdAndUpdate(adopterId, {
      $inc: { 'stats.animalsAdopted': 1 }
    });

    // Send confirmation email to adopter
    await sendEmail(
      adopter.email,
      'Congratulations! Adoption Confirmed - Stray2Stay',
      `Hi ${adopter.name},\n\nCongratulations! Your adoption of ${animal.name || 'the ' + animal.type} has been confirmed.\n\nThank you for giving a stray animal a loving home!\n\nBest regards,\nStray2Stay Team`
    );

    res.json({ message: 'Animal marked as adopted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;