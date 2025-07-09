import mongoose from 'mongoose';

const adoptionSchema = new mongoose.Schema({
  animal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal',
    required: true
  },
  adopter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  poster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'completed', 'cancelled'],
    default: 'pending'
  },
  adopterMessage: {
    type: String,
    default: ''
  },
  adopterContact: {
    type: String,
    required: true
  },
  adoptionDate: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('Adoption', adoptionSchema);