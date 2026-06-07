import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Conversation from './Conversation';

class Message extends Model {
  public id!: number;
  public conversationId!: number;
  public role!: 'user' | 'assistant';
  public content!: string;
}

Message.init({
  id:             { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  conversationId: { type: DataTypes.INTEGER, allowNull: false },
  role:           { type: DataTypes.ENUM('user', 'assistant'), allowNull: false },
  content:        { type: DataTypes.TEXT, allowNull: false },
}, { sequelize, modelName: 'Message' });

Conversation.hasMany(Message, { foreignKey: 'conversationId' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId' });

export default Message;