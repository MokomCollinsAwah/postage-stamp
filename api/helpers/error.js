/**
 * @module ErrorHandler Custom error handler
 */
export class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

/**
 * Handle thrown errors
 * @param {Error} err
 * @param {Response} res
 */
export const handleError = (err, res) => {
  const { statusCode, message } = err;
  if (statusCode) {
    return res.status(statusCode).send({
      error: message
    });
  }
  return res.status(400).send({
    error: message
  });
};
