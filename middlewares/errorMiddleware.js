import { envMode } from "../server.js";

const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  const response = {
    success: false,
    message: err.message,
  };

  if (envMode === "DEVELOPMENT") {
    response.error = err;
    console.error(err);
  }

  return res.status(err.statusCode).json(response);
};

export default errorMiddleware;
