import jwt from 'jsonwebtoken';

export const generateToken = (userId: number, name: string, email: string) => {
  return jwt.sign(
    { id: userId, name, email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
};