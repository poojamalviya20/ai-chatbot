import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';

import './models/User';
import './models/Conversation';
import './models/Message';

dotenv.config();
const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', chatRoutes);

sequelize.sync({ alter: true }).then(() => {
  console.log('DB connected & synced');
  app.listen(5000, () => console.log('Server on port 5000'));
});