export const sendSuccess = (res, statusCode = 200, data = {}) => {
  res.status(statusCode).json({ success: true, ...data });
};

export const sendError = (res, statusCode = 400, message = 'Something went wrong') => {
  res.status(statusCode).json({ success: false, message });
};
