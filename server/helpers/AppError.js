class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const handleError = (res, error) => {
    //console.error(error);
    res.status(error.statusCode || 500).json({ error: error.message });
};

module.exports = { AppError, handleError }
