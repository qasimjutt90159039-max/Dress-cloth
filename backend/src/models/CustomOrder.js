import mongoose from 'mongoose';

const customOrderSchema = new mongoose.Schema({
  requestNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone / WhatsApp is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true
  },
  city: {
    type: String,
    required: true
  },
  dressType: {
    type: String,
    default: 'Bridal Dress' // Bridal, Formal Party Wear, Kurti, Lehenga, Maxi, Sharara
  },
  fabricChoice: {
    type: String,
    required: true
  },
  colorChoice: {
    type: String,
    required: true
  },
  embroideryDetails: {
    type: String,
    required: true
  },
  measurements: {
    unit: { type: String, default: 'inches' },
    shirtLength: { type: String, default: '' },
    shoulder: { type: String, default: '' },
    chest: { type: String, default: '' },
    waist: { type: String, default: '' },
    hips: { type: String, default: '' },
    sleeveLength: { type: String, default: '' },
    armHole: { type: String, default: '' },
    neckDepth: { type: String, default: '' },
    trouserLength: { type: String, default: '' },
    trouserWaist: { type: String, default: '' },
    trouserBottom: { type: String, default: '' },
    additionalInstructions: { type: String, default: '' }
  },
  referenceImages: [{
    type: String
  }],
  estimatedBudgetPKR: {
    type: Number,
    default: 0
  },
  targetDeadline: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'quoted', 'in_crafting', 'completed', 'cancelled'],
    default: 'pending'
  },
  adminQuotation: {
    price: { type: Number, default: 0 },
    timelineDays: { type: Number, default: 0 },
    notes: { type: String, default: '' }
  }
}, {
  timestamps: true
});

export default mongoose.models.CustomOrder || mongoose.model('CustomOrder', customOrderSchema);
