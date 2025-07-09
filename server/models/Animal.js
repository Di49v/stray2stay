import mongoose from 'mongoose';

const animalSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['dog', 'cat']
  },
  name: {
    type: String,
    default: ''
  },
  breed: {
    type: String,
    default: ''
  },
  age: {
    type: String,
    enum: ['puppy/kitten', 'young', 'adult', 'senior', 'unknown'],
    default: 'unknown'
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    default: 'unknown'
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large', 'unknown'],
    default: 'unknown'
  },
  color: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  specialNotes: {
    type: String,
    default: ''
  },
  photos: [{
    type: String,
    required: true
  }],
  location: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    city: String,
    state: String
  },
  currentLocation: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['available', 'under_consideration', 'adopted'],
    default: 'available'
  },
  urgent: {
    type: Boolean,
    default: false
  },
  needsFoster: {
    type: Boolean,
    default: false
  },
  medicalNeeds: {
    type: String,
    default: ''
  },
  posterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adopterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  interestedUsers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    contactInfo: String,
    timestamp: { type: Date, default: Date.now }
  }],
  adoptionDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

animalSchema.index({ location: '2dsphere' });
animalSchema.index({ type: 1, status: 1 });
animalSchema.index({ posterId: 1 });

export default mongoose.model('Animal', animalSchema);