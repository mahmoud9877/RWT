import express from "express";
import { config } from "dotenv";
import initApp from "./src/app.router.js";
import sequelize from './src/database/connection.js'
import { globalLimiter } from "./src/middleware/rateLimiter.js";

config();


const app = express();
const port = process.env.PORT || 5000;
console.log(port)

app.use(globalLimiter);
initApp(app, express);


async function connectWithRetry(retries = 3, delay = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Attempt ${attempt} to connect to PostgreSQL...`);
      await sequelize.authenticate();
      console.log("PostgreSQL connected successfully!");
      await sequelize.sync({ alter: false });
      console.log("Models synced successfully!");
      return;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);

      if (attempt === retries) {
        console.error("All connection attempts failed. Exiting...");
        process.exit(1);
      }

      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

(async () => {
  await connectWithRetry(3, 3000);
})();

app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${port}`
  );
});
