import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User';
import { Op } from 'sequelize';
import { generateToken } from '../utils/jwt';
import { sendResetEmail } from './emailService';

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const { name, email, password } = data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user.id, user.name, user.email);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const { email, password } = data;

  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error('Wrong password');
  }

  const token = generateToken(user.id, user.name, user.email);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw { status: 404, message: 'Email not found' };

  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiry     = new Date(Date.now() + 15 * 60 * 1000);

  await user.update({ resetToken, resetTokenExpiry: expiry });
  await sendResetEmail(email, resetToken);

  return { message: 'Reset email sent successfully' };
};

export const resetPassword = async ({ token, newPassword }: { token: string; newPassword: string }) => {
  const user = await User.findOne({
    where: {
      resetToken:       token,
      resetTokenExpiry: { [Op.gt]: new Date() },
    },
  });
  if (!user) throw { status: 400, message: 'Invalid or expired token' };

  const hashed = await bcrypt.hash(newPassword, 10);
  await user.update({ password: hashed, resetToken: null, resetTokenExpiry: null });

  return { message: 'Password reset successful' };
};