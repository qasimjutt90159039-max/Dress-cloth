import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    trim: true
  },
  phone: {
    type: String,
    default: '',
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message cannot be empty']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  replyNote: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.models.Message || mongoose.model('Message', messageSchema);
