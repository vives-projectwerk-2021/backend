
class ErrorResponse extends Error {
    constructor(status, message, details) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

/**
 * Express error handler middleware.
 *
 * @param {ErrorResponse} err - An ErrorReponse object. See src/response/errorResponse.js
 */
function errorHandlerMiddleware(err, req, res, next) {
    // create default error response body
    const error_response = {
        status: err.status,
        message: err.message,
        timestamp: new Date().toISOString()
    }

    // details is optional
    if (err.details) {
        error_response['details'] = err.details
    }

    res.status(err.status).send(error_response)
}

export default errorHandlerMiddleware;
export { ErrorResponse };