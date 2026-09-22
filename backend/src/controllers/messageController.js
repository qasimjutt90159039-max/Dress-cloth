import Message from '../models/Message.js';

export const createMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message.' });
    }

    const newMessage = await Message.create({
      name,
      email,
      phone: phone || '',
      subject: subject || 'Store Inquiry',
      message
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to Hand Embroidered Dresses. Our Multan customer support team will get in touch shortly.',
      data: newMessage
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort('-createdAt');
    res.status(200).json({ success: true, count: messages.length, messages });
  } catch (error) {
    next(error);
  }
};

export const markMessageRead = async (req, res, next) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    msg.isRead = true;
    await msg.save();
    res.status(200).json({ success: true, message: 'Message marked as read', msg });
  } catch (error) {
    next(error);
  }
};

export const replyMessage = async (req, res, next) => {
  try {
    const { replyNote } = req.body;
    const msg = await Message.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    msg.replyNote = replyNote;
    msg.isRead = true;
    await msg.save();
    res.status(200).json({ success: true, message: 'Reply note saved', msg });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    await msg.deleteOne();
    res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
};
