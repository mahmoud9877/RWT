import { DataTypes } from "sequelize";
import sequelize from "../connection.js";
import User from "./User.model.js";

const Task = sequelize.define("Task", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  aSignTo: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM("pending", "in_progress", "done"),
    defaultValue: "pending"
  }
}, {
  timestamps: true
});

User.hasMany(Task, { foreignKey: "aSignTo", as: "receivedTasks" });

Task.belongsTo(User, { foreignKey: "aSignTo", as: "assignee" });

export default Task;
