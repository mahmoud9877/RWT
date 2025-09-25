import { DataTypes } from "sequelize";
import sequelize from "../connection.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM("admin", "employee"),
    allowNull: false,
    defaultValue: "employee"
  },
  apiKey: {
    type: DataTypes.STRING, // ده اللي هتستخدمه في الـ Auth
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: true
});


export default User;
