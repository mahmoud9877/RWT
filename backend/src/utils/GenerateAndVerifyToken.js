// import jwt from "jsonwebtoken";

// export const generateToken = ({ payload = {}, expiresIn = "30d", secret = process.env.TOKEN_SIGNATURE } = {}) => {
//   if (!secret) throw new Error("Missing TOKEN_SIGNATURE in environment variables");
//   return jwt.sign(payload, secret, { expiresIn });
// };

// export const verifyToken = ({ token, secret = process.env.TOKEN_SIGNATURE }) => {
//   if (!secret) throw new Error("Missing TOKEN_SIGNATURE in environment variables");
//   try {
//     return jwt.verify(token, secret); // هيرجع payload لو صالح
//   } catch (err) {
//     return null; // لو غير صالح
//   }
// };
