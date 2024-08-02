import { ErrorMiddleware } from "../types"


const errorCatcher: ErrorMiddleware = (err, req, res, next): void => {
    if (err.statusCode) {
        res.status(err.statusCode).send({
            name: err.name,
            message: err.message,
            statusCode: err.statusCode,
        });
    } else {
        res.status(500).send({
            name: err.name,
            message: err.message,
            statusCode: 500,
        });
    }
};

export default errorCatcher;
