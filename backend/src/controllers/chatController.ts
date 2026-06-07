import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as chatService from '../services/chatService';

export const createConversation = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const conversation = await chatService.createConversation(
      req.userId!
    );

    res.json(conversation);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getConversations = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const conversations = await chatService.getConversations(
      req.userId!
    );

    res.json(conversations);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const sendMessage = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result = await chatService.sendMessage({
      conversationId: Number(req.params.id),
      content: req.body.content,
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getMessages = async (
  req: Request,
  res: Response
) => {
  try {
    const messages = await chatService.getMessages(
      Number(req.params.id)
    );

    res.json(messages);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
};