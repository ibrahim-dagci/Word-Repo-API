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
            req.user = await jwt.verify(token, process.env.JWT_SECRET_KEY) as Person;
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
            req.admin = await jwt.verify(token, "adminkey") as Person;
        } else throw createError(400, "bad request for auth");

        next();
    } catch (err) {
        next(err);
    }
};

export default {
    adminAuth,
    userAuth
}
