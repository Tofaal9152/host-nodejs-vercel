import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import { connectPassport } from "./controllers/auth.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import routes from "./routes/index.js";

// Load environment variables
dotenv.config();

const app = express();
const envMode = process.env.NODE_ENV?.trim() || "DEVELOPMENT";
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(
  helmet({
    contentSecurityPolicy: envMode !== "DEVELOPMENT",
    crossOriginEmbedderPolicy: envMode !== "DEVELOPMENT",
  })
);
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "token",
    cookie: {
      secure: envMode !== "DEVELOPMENT",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"));
app.use(cookieParser());
// Connect Passport
connectPassport();

// Use the routes
app.use(routes);

// Error handling middleware
app.use(errorMiddleware);

// Start server
const StartServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running in ${envMode} mode on port ${PORT}`);
    });
  } catch (error) {
    console.log("Error starting server", error);
  }
};

StartServer();

export { envMode };

