import { CustomMiddleware, Person } from "../types";
import createError from "http-errors";
import jwt from "jsonwebtoken";

const userAuth: CustomMiddleware = async (req, res, next) => {
    try {
        const auth = req.header("Authorization");
        if (auth) {
            const token = auth.replace("Bearer ", "");
            req.user = await jwt.verify(token, "userkey") as Person;
        } else throw createError(400, "bad request for auth");

        next();
    } catch (err) {
        next(err);
    }
};

const adminAuth: CustomMiddleware = async (req, res, next) => {
    try {
        const auth = req.header("Authorization");
        if (auth) {
            const token = auth.replace("Bearer ", "");
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
