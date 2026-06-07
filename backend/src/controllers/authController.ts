import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.registerUser(req.body);

    res.json(result);
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(req.body);

    res.json(result);
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};