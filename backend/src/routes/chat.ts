import express from 'express';
import { protect, AuthRequest } from '../middleware/authMiddleware';
import Conversation from '../models/Conversation';
import Message from '../models/Message';
import { getChatResponse } from '../services/groqService';

const router = express.Router();

// New conversation
router.post('/conversations', protect, async (req: AuthRequest, res) => {
  const conv = await Conversation.create({ userId: req.userId, title: 'New Chat' });
  res.json(conv);
});

// Get all conversations for user
router.get('/conversations', protect, async (req: AuthRequest, res) => {
  const convs = await Conversation.findAll({ where: { userId: req.userId }, order: [['createdAt', 'DESC']] });
  res.json(convs);
});

// Send message
router.post('/conversations/:id/messages', protect, async (req: AuthRequest, res) => {
  const { content } = req.body;
  const convId = parseInt(req.params.id as string);

  await Message.create({ conversationId: convId, role: 'user', content });

  const history = await Message.findAll({ where: { conversationId: convId }, order: [['createdAt', 'ASC']] });
  const messages = history.map(m => ({ role: m.role, content: m.content }));

  const reply = await getChatResponse(messages);
  await Message.create({ conversationId: convId, role: 'assistant', content: reply });

  // Update conversation title from first message
  if (history.length === 1) {
    await Conversation.update({ title: content.slice(0, 40) }, { where: { id: convId } });
  }

  res.json({ reply });
});

// Get messages of a conversation
router.get('/conversations/:id/messages', protect, async (req, res) => {
  const messages = await Message.findAll({
    where: { conversationId: req.params.id },
    order: [['createdAt', 'ASC']],
  });
  res.json(messages);
});

export default router;