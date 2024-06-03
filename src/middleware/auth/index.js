const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const userAuth = async (req, res, next) => {
    try {
        const auth = req.header("Authorization");
        if (auth) {
            const token = auth.replace("Bearer ", "");
            req.user = await jwt.verify(token, "userkey");
        } else throw createError(400, "bad request for auth");

        next();
    } catch (err) {
        next(err);
    }
};

const adminAuth = async (req, res, next) => {
    try {
        const auth = req.header("Authorization");
        if (auth) {
            const token = auth.replace("Bearer ", "");
            req.admin = await jwt.verify(token, "adminkey");
        } else throw createError(400, "bad request for auth");

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = {
    userAuth,
    adminAuth,
};
