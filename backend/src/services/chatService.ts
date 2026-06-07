import Conversation from '../models/Conversation';
import Message from '../models/Message';
import { getChatResponse } from './groqService';

export const createConversation = async (
  userId: number
) => {
  return Conversation.create({
    userId,
    title: 'New Chat',
  });
};

export const getConversations = async (
  userId: number
) => {
  return Conversation.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
  });
};

export const sendMessage = async ({
  conversationId,
  content,
}: {
  conversationId: number;
  content: string;
}) => {
  await Message.create({
    conversationId,
    role: 'user',
    content,
  });

  const history = await Message.findAll({
    where: { conversationId },
    order: [['createdAt', 'ASC']],
  });

  const messages = history.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  const reply = await getChatResponse(messages);

  await Message.create({
    conversationId,
    role: 'assistant',
    content: reply,
  });

  if (history.length === 1) {
    await Conversation.update(
      {
        title: content.slice(0, 40),
      },
      {
        where: {
          id: conversationId,
        },
      }
    );
  }

  return {
    reply,
  };
};

export const getMessages = async (
  conversationId: number
) => {
  return Message.findAll({
    where: {
      conversationId,
    },
    order: [['createdAt', 'ASC']],
  });
};