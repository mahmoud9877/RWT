import express from "express";
import { config } from "dotenv";
import initApp from "./src/app.router.js";
import sequelize from "./src/database/connection.js";

config();

const app = express();
const port = 5000;

initApp(app, express);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected successfully!");
    await sequelize.sync({ alter: false });
    console.log("✅ Models synced successfully!");
  } catch (error) {
    console.error("❌ Unable to connect to PostgreSQL:", error.message);
  }
})();


app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${port}`
  );
});
