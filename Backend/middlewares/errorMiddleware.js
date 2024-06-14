
class ErrorHandler extends Error{
    constructor(message, stausCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
    //if there is email or anything duplicate
    if (err.code===11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name==="jsonWebTokenError") {
        const message = "Json Web Token Is Invalid ,Try Again!";
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "TokenExpiredError") {
        const message = "JSON web token is expired try again!";
        err = new ErrorHandler(message, 400);
    }

    //if type not match or validation error
    if (err.name === "CastError") {
        const message = `Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }
    //doubt
    const errorMessage = err.errors ? Object.values(err.errors).map(error => error.message).join(" ") : err.message;
    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
    })
}

export default ErrorHandler;