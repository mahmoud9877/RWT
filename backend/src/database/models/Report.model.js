import { DataTypes } from "sequelize";
import sequelize from "../connection.js";
import User from "./User.model.js";
import Task from "./Task.model.js";

const Report = sequelize.define("Report", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    employee_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Users",
            key: "id"
        }
    },
    task_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: "Tasks",
            key: "id"
        }
    },
    file: {
        type: DataTypes.STRING,
        allowNull: true
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    summary: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true
});

User.hasMany(Report, { foreignKey: "employee_id", as: "reports" });
Report.belongsTo(User, { foreignKey: "employee_id", as: "employee" });

Task.hasMany(Report, { foreignKey: "task_id", as: "taskReports" });
Report.belongsTo(Task, { foreignKey: "task_id", as: "task" });

export default Report
