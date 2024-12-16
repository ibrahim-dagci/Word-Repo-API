import Admin from "../../model/admin";
import createError from "http-errors";
import bcrypt from "bcrypt";
import {
    CustomMiddleware,
    Middleware
} from "../../middleware/types";
import { sendJwtToClient } from "../../helper/authorization";


const adminSignUp: Middleware = async (req, res, next) => {
    try {
        const currentAdmin = new Admin(req.body);
        currentAdmin.password = await bcrypt.hash(currentAdmin.password, 8);
        const savedAdmin = await currentAdmin.save();
        return res.send({
            message: "admin created",
            statusCode: 200,
            name: "succes",
        });
    } catch (err) {
        next(createError(500, "admin registration error"));
    }
};

const adminSignIn: Middleware = async (req, res, next) => {
    try {
        const admin = await Admin.signIn(req.body.email, req.body.password);
        await sendJwtToClient(admin, res);
    } catch (err) {
        next(createError(500, "admin sign in error"));
    }
};

const adminUpdate: CustomMiddleware = async (req, res, next) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 8);
        const updated = await Admin.findByIdAndUpdate(
            { _id: req.admin._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (updated) {
            return res.send(updated);
        } else {
            return res
                .status(404)
                .json({ message: "admin not found", statusCode: 404 });
        }
    } catch (err) {
        next(createError(500, "admin update error"));
    }
};

const adminDelete: CustomMiddleware = async (req, res, next) => {
    try {
        const finded = await Admin.findByIdAndDelete(req.admin._id);
        if (finded) {
            return res.send(finded);
        } else {
            return res.status(404).json({ message: "admin not found" });
        }
    } catch (err) {
        next(createError(500, "admin delete error"));
    }
};

export {
    adminSignUp,
    adminSignIn,
    adminUpdate,
    adminDelete
};
