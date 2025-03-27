import express from "express";
import authRouter from "./auth.js";

const router = express.Router();

// Define API routes
router.use("/api/auth", authRouter);

router.get("/", (req, res) => {
  return res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Home Page</title>
      </head>
      <body>
        <h1>Welcome to the Home Page</h1>
        <p>This is a basic Express.js server returning HTML.</p>
      </body>
    </html>
  `);
});
// Handle 404 routes
router.use("*", (req, res) => {
  return res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>404 Not Found</title>
      </head>
      <body>
        <h1>404 Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </body>
    </html>
  `);
});

export default router;
