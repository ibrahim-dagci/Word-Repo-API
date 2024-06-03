const mongoose = require("mongoose");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const schema = mongoose.Schema;

const AdminSchema = new schema(
    {
        userName: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { collection: "admins", timestamps: true }
);

AdminSchema.statics.signIn = async (email, password) => {
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
        throw createError(400, "incorrect entry");
    }

    const passwordControl = await bcrypt.compare(password, admin.password);

    if (!passwordControl) {
        throw createError(400, "incorrect email or password entry");
    }
    return admin;
};

AdminSchema.methods.toJSON = function () {
    const admin = this.toObject();
    delete admin.createdAt;
    delete admin.updatedAt;
    delete admin.password;
    delete admin.__v;
    return admin;
};

AdminSchema.methods.generateToken = async function (userObject) {
    const admin = this;
    const token = await jwt.sign(
        {
            _id: admin._id,
            userName: admin.userName,
        },
        "adminkey",
        { expiresIn: "24h" }
    );
    return token;
};

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
