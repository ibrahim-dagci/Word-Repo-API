const User = require("../../model/user");
const createError = require("http-errors");
const bcrypt = require("bcrypt");

const getAllUser = async (req, res, next) => {
    try {
        //const allUsers = await User.find({});
        return res.status(501).send({
            name: "Warning",
            message: "This operation cannot be performed at the moment.",
        });
    } catch (err) {
        next(createError(500, "fetch error", err));
    }
};

const getCurrentUser = async (req, res, next) => {
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
        next(createError(500, "fetch error", err));
    }
};

const signUp = async (req, res, next) => {
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
        next(createError(500, "registration error", err));
    }
};

const signIn = async (req, res, next) => {
    try {
        const user = await User.signIn(req.body.email, req.body.password);
        const token = await user.generateToken();
        res.send({ user, token });
    } catch (err) {
        next(createError(500, "Sign In error", err));
    }
};

const userUpdate = async (req, res, next) => {
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
        next(createError(500, "update error", err));
    }
};

const userDelete = async (req, res, next) => {
    try {
        const finded = await User.findByIdAndDelete(req.user._id);
        if (finded) {
            return res.send(finded);
        } else {
            return res.status(404).json({ message: "user not found" });
        }
    } catch (err) {
        next(createError(500, "delete error", err));
    }
};

module.exports = {
    getAllUser,
    getCurrentUser,
    signUp,
    signIn,
    userUpdate,
    userDelete,
};
