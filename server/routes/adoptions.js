import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Adoption from '../models/Adoption.js';
import Animal from '../models/Animal.js';
import { sendEmail } from '../utils/email.js';

const router = express.Router();

// Get all adoptions for a user
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const adoptions = await Adoption.find({
      $or: [
        { adopter: req.user._id },
        { poster: req.user._id }
      ]
    })
      .populate('animal', 'name type photos')
      .populate('adopter', 'name email phone')
      .populate('poster', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json({ adoptions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create adoption request
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { animalId, message, contactInfo } = req.body;
    
    const animal = await Animal.findById(animalId).populate('posterId', 'name email');
    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    
    if (animal.status === 'adopted') {
      return res.status(400).json({ error: 'Animal has already been adopted' });
    }
    
    if (animal.posterId._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot adopt your own listing' });
    }
    
    // Check if adoption request already exists
    const existingAdoption = await Adoption.findOne({
      animal: animalId,
      adopter: req.user._id,
      status: { $in: ['pending', 'approved'] }
    });
    
    if (existingAdoption) {
      return res.status(400).json({ error: 'Adoption request already exists' });
    }
    
    const adoption = new Adoption({
      animal: animalId,
      adopter: req.user._id,
      poster: animal.posterId._id,
      adopterMessage: message,
      adopterContact: contactInfo
    });
    
    await adoption.save();
    
    // Send notification email
    await sendEmail(
      animal.posterId.email,
      'New Adoption Request - Stray2Stay',
      `Hi ${animal.posterId.name},\n\nYou have a new adoption request for ${animal.name || 'your ' + animal.type}!\n\nAdopter: ${req.user.name}\nContact: ${contactInfo}\nMessage: ${message}\n\nPlease review and respond to this request.\n\nBest regards,\nStray2Stay Team`
    );
    
    res.status(201).json({
      message: 'Adoption request created successfully',
      adoption: await Adoption.findById(adoption._id)
        .populate('animal', 'name type photos')
        .populate('adopter', 'name email')
        .populate('poster', 'name email')
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update adoption status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const adoption = await Adoption.findById(req.params.id)
      .populate('animal')
      .populate('adopter', 'name email')
      .populate('poster', 'name email');
    
    if (!adoption) {
      return res.status(404).json({ error: 'Adoption not found' });
    }
    
    // Only poster can update status
    if (adoption.poster._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    adoption.status = status;
    if (notes) adoption.notes = notes;
    
    if (status === 'completed') {
      adoption.adoptionDate = new Date();
      // Update animal status
      await Animal.findByIdAndUpdate(adoption.animal._id, {
        status: 'adopted',
        adopterId: adoption.adopter._id,
        adoptionDate: new Date()
      });
    }
    
    await adoption.save();
    
    // Send notification email
    let emailSubject = 'Adoption Request Update - Stray2Stay';
    let emailBody = `Hi ${adoption.adopter.name},\n\nYour adoption request for ${adoption.animal.name || 'the ' + adoption.animal.type} has been ${status}.\n\n`;
    
    if (status === 'completed') {
      emailBody += 'Congratulations! Thank you for giving a stray animal a loving home.\n\n';
    } else if (status === 'approved') {
      emailBody += 'Your request has been approved! The poster will contact you soon to arrange the adoption.\n\n';
    }
    
    if (notes) {
      emailBody += `Notes: ${notes}\n\n`;
    }
    
    emailBody += 'Best regards,\nStray2Stay Team';
    
    await sendEmail(adoption.adopter.email, emailSubject, emailBody);
    
    res.json({
      message: 'Adoption status updated successfully',
      adoption
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;