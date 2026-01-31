class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404)
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400)
  }
}

module.exports = {
  AppError,
  NotFoundError,
  BadRequestError
}
