import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class Conversation extends Model {
  public id!: number;
  public userId!: number;
  public title!: string;
}

Conversation.init({
  id:     { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  title:  { type: DataTypes.STRING, defaultValue: 'New Chat' },
}, { sequelize, modelName: 'Conversation' });

User.hasMany(Conversation, { foreignKey: 'userId' });
Conversation.belongsTo(User, { foreignKey: 'userId' });

export default Conversation;