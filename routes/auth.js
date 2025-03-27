import express from "express";
import passport from "passport";
import { GetProfile, Login, Logout, Register } from "../controllers/auth.js";
import isAuthenticated from "../controllers/isAuthenticated.js";

const router = express.Router();

// Google Authentication Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
// Google OAuth Callback Route
router.get(
  "/callback/google",
  passport.authenticate("google", {
    failureRedirect: ` ${process.env.CLIENT_URL}/login`,
  }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}`);
  }
);
// Register and Login Routes
router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/profile").get(isAuthenticated,GetProfile);
router.route("/logout").post(Logout)

export default router;
