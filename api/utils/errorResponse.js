class ErrorResponse extends Error {
  constructor(message = 'Internal server error', statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;

    if (isNaN(parseInt(statusCode, 10))) {
      throw new TypeError(`HTTP status code must be a number, received: ${statusCode}`);
    }

    if (typeof message !== 'string' || message.trim().length === 0) {
      throw new TypeError(`Message must be a non-empty string, received: ${message}`);
    }

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;
