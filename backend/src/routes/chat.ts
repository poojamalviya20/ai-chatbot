import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  createConversation,
  getConversations,
  sendMessage,
  getMessages,
} from '../controllers/chatController';

const router = express.Router();

router.post('/conversations', protect, createConversation);
router.get('/conversations', protect, getConversations);
router.post('/conversations/:id/messages', protect, sendMessage);
router.get('/conversations/:id/messages', protect, getMessages);

export default router;