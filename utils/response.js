export const Response = {
  success: (res, status, message, data) => {
    res.status(status).json({
      success: true,
      message,
      data,
    });
  },
  error: (res, status, message) => {
    res.status(status).json({
      success: false,
      message,
    });
  },
};
