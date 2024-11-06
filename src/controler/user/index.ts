import createError from "http-errors";
import User from "../../model/user";
import bcrypt from "bcrypt";
import {
    CustomMiddleware,
    Middleware
} from "../../middleware/types";
import {
    sendJwtToClient
} from "../../helper/authorization";


const getAllUser: Middleware = async (req, res, next) => {
    try {
        //const allUsers = await User.find({});
        return res.status(501).send({
            name: "Warning",
            message: "This operation cannot be performed at the moment.",
        });
    } catch (err) {
        next(createError(500, "users fetch error"));
    }
};

const getCurrentUser: CustomMiddleware = async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser) {
            return res.send(currentUser);
        } else {
            res.status(404).json({
                message: "user not found",
                statusCpde: 404,
            });
        }
    } catch (err) {
        next(createError(500, "user fetch error"));
    }
};

const signUp: Middleware = async (req, res, next) => {
    try {
        const currentUser = new User(req.body);
        currentUser.password = await bcrypt.hash(currentUser.password, 8);
        const savedUser = await currentUser.save();
        return res.send({
            message: "user created",
            statusCode: 200,
            name: "succes",
        });
    } catch (err) {
        next(createError(500, "user registration error"));
    }
};

const signIn: Middleware = async (req, res, next) => {
    try {
        const user = await User.signIn(req.body.email, req.body.password);
        await sendJwtToClient(user, res);
    } catch (err) {
        next(createError(500, "user sign in error"));
        console.log(err);
    }
};

const userUpdate: CustomMiddleware = async (req, res, next) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 8);
        const updated = await User.findByIdAndUpdate(
            { _id: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (updated) {
            return res.send(updated);
        } else {
            return res
                .status(404)
                .json({ message: "user not found", statusCode: 404 });
        }
    } catch (err) {
        next(createError(500, "user update error"));
    }
};

const userDelete: CustomMiddleware = async (req, res, next) => {
    try {
        const finded = await User.findByIdAndDelete(req.user._id);
        if (finded) {
            return res.send(finded);
        } else {
            return res.status(404).json({ message: "user not found" });
        }
    } catch (err) {
        next(createError(500, "user delete error"));
    }
};

export {
    getCurrentUser,
    userDelete,
    getAllUser,
    userUpdate,
    signUp,
    signIn,
};
