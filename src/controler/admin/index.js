const Admin = require("../../model/admin");
const createError = require("http-errors");
const bcrypt = require("bcrypt");

const adminSignUp = async (req, res, next) => {
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
        next(createError(500, "registration error", err));
    }
};

const adminSignIn = async (req, res, next) => {
    try {
        const admin = await Admin.signIn(req.body.email, req.body.password);
        const token = await admin.generateToken();
        res.send({ admin, token });
    } catch (err) {
        next(createError(500, "Sign In error", err));
    }
};

const adminUpdate = async (req, res, next) => {
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
        next(createError(500, "admin update error", err));
    }
};

const adminDelete = async (req, res, next) => {
    try {
        const finded = await Admin.findByIdAndDelete(req.admin._id);
        if (finded) {
            return res.send(finded);
        } else {
            return res.status(404).json({ message: "admin not found" });
        }
    } catch (err) {
        next(createError(500, "admin delete error", err));
    }
};

module.exports = {
    adminSignUp,
    adminSignIn,
    adminUpdate,
    adminDelete,
};
