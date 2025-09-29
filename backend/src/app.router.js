import cors from 'cors';
import authRouter from "./modules/auth/auth.route.js";
import taskRouter from './modules/task/task.route.js'
import reportRouter from './modules/report/report.route.js'
import employeeRouter from "./modules/employee/employee.route.js";
import { globalErrorHandling } from "./utils/errorHandling.js";
import sequelize from "./database/connection.js";

const initApp = (app, express) => {
  app.use("/uploads", express.static("uploads"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(cors())
  app.get("/health", async (req, res) => {
    try {
      await sequelize.authenticate();
      res.status(200).json({
        status: "ok",
        db: "connected",
        env: process.env.NODE_ENV || "development",
      });
    } catch {
      res.status(500).json({ status: "error", db: "disconnected" });
    }
  });

  // ✅ API routes
  app.use("/api/auth", authRouter);
  app.use("/api/employee", employeeRouter);
  app.use("/api/task", taskRouter);
  app.use("/api/report", reportRouter);

  app.all("*", (req, res) => {
    res.status(404).json({
      success: false,
      message: "Invalid route",
      path: req.originalUrl,
      method: req.method,
    });
  });
  app.use(globalErrorHandling);
};

export default initApp;
