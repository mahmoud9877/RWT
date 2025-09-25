import { asyncHandler } from "../utils/errorHandling.js";
import userModel from "../database/models/User.model.js";

const roles = ['admin', 'employee'];

export const auth = (accessRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    const token = req.headers['authorization']

    if (!apiKey) {
      return res
        .status(401)
        .json({ success: false, message: "API Key is required" });
    }
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token is required" });
    }

    const user = await userModel.findOne({
      where: { apiKey },
      attributes: ["id", "name", "role"],
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid API Key" });
    }

    if (accessRoles.length && !accessRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied: insufficient role" });
    }

    req.user = user;

    if (process.env.NODE_ENV === "development") {
      console.log("Authenticated user:", user.toJSON());
    }
    next();
  });
};
