import { CustomMiddleware, Person } from "../types";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import {
    getAccesTokenFromHeader,
    isTokenIncluded
} from "../../helper/authorization";

const userAuth: CustomMiddleware = async (req, res, next) => {
    try {
        if (isTokenIncluded(req)) {
            const token = getAccesTokenFromHeader(req)
            req.user = await jwt.verify(token, process.env.JWT_USER_SECRET_KEY) as Person;
        } else throw createError(400, "bad request for auth");

        next();
    } catch (err) {
        next(err);
    }
};

const adminAuth: CustomMiddleware = async (req, res, next) => {
    try {
        if (isTokenIncluded(req)) {
            const token = getAccesTokenFromHeader(req)
            req.admin = await jwt.verify(token, process.env.JWT_ADMIN_SECRET_KEY) as Person;
        } else throw createError(400, "bad request for auth");

        next();
    } catch (err) {
        next(err);
    }
};

const serverAuth: CustomMiddleware = async (req, res, next) => {
    try {
        if (isTokenIncluded(req)) {
            const token = getAccesTokenFromHeader(req)
            await jwt.verify(token, process.env.JWT_SERVER_SECRET_KEY)
        } else throw createError(400, "bad request for auth");

        next();
    } catch (err) {
        next(err);
    }
};

const voiceAuth: CustomMiddleware = (req, res, next) => {
    userAuth(req, res, (err) => {
        if (err) {
            return serverAuth(req, res, next);
        }
        next();
    });
};

export default {
    serverAuth,
    voiceAuth,
    adminAuth,
    userAuth
}
