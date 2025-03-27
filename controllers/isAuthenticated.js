import jwt from "jsonwebtoken";
import { Response } from "../utils/response.js";
import TryCatch from "../utils/tryCatch.js";

const isAuthenticated = TryCatch(async (req, res, next) => {
  if (req.user) {
    return next();
  } else {
    const token = req.cookies.token;
    if (!token) {
      return Response.error(res, "Access denied", 401);
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: verified.id };
    next();
  }
});

export default isAuthenticated;
