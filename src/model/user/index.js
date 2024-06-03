const mongoose = require("mongoose");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const schema = mongoose.Schema;

const UserSchema = new schema(
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
        primaryLanguage: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
    },
    { collection: "users", timestamps: true }
);

UserSchema.statics.signIn = async (email, password) => {
    const user = await User.findOne({ email: email });
    if (!user) {
        throw createError(400, "incorrect entry");
    }

    const passwordControl = await bcrypt.compare(password, user.password);

    if (!passwordControl) {
        throw createError(400, "incorrect email or password entry");
    }
    return user;
};

UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.createdAt;
    delete user.updatedAt;
    delete user.password;
    delete user.__v;
    return user;
};

UserSchema.methods.generateToken = async function (userObject) {
    const user = this;
    const token = await jwt.sign(
        {
            _id: user._id,
            userName: user.userName,
            primaryLanguage: user.primaryLanguage,
        },
        "userkey",
        { expiresIn: "24h" }
    );
    return token;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
