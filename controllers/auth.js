import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../config/prisma.js";
import { comparePassword, hashedPassword } from "../utils/hash.js";
import { Response } from "../utils/response.js";
import TryCatch from "../utils/tryCatch.js";
export const connectPassport = async (req, res) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        const user = await prisma.user.findUnique({
          where: {
            email: profile.emails[0].value,
          },
        });
        if (user) {
          return done(null, user);
        }
        const newUser = await prisma.user.create({
          data: {
            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          },
        });
        return done(null, newUser);
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    done(null, user);
  });
};
export const Register = TryCatch(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return Response.error(res, 400, "Please provide all fields");
  }
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (existingUser) {
    return Response.error(res, 400, "User already exists");
  }

  const hashpassword = await hashedPassword(password);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashpassword,
    },
  });
  return Response.success(res, 201, "User created successfully", null);
});
export const Login = TryCatch(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Response.error(res, 400, "Please provide all fields");
  }
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return Response.error(res, 400, "Invalid credentials");
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return Response.error(res, 400, "Invalid credentials");
  }
  //
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "DEVELOPMENT",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  return Response.success(res, 200, "User logged in successfully", null);
});
export const GetProfile = TryCatch(async (req, res) => {
  console.log(req.id);
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    select: {
      name: true,
      email: true,
    },
  });
  return Response.success(
    res,
    200,
    "User profile retrieved successfully",
    user
  );
});

export const Logout = TryCatch(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "DEVELOPMENT",
  });
  return Response.success(res, 200, "User logged out successfully", null);
});
