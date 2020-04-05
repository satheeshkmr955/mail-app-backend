class ErrorResponse extends Error {
  constructor(message = "Server Encounter Error", statusCode = "500") {
    // Calling parent constructor of base Error class.
    super(message);
    this.statusCode = statusCode;
    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;
