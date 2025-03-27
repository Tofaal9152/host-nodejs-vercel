import express from "express";
import { Response } from "../utils/response.js";
import authRouter from "./auth.js";

const router = express.Router();

// Define API routes
router.use("/api/auth", authRouter);

// Root route
router.get("/", (req, res) => {
  return Response.success(res, 200, "Server is running", null);
});

// Handle 404 routes
router.use("*", (req, res) => {
  return Response.error(res, 404, "Route not found");
});

export default router;
