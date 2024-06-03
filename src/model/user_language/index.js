const mongoose = require("mongoose");
const schema = mongoose.Schema;

const User_LanguageSchema = new schema(
    {
        userId: {
            type: String,
            required: true,
            trim: true,
        },
        languageSymbol: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
    },
    { collection: "user_languages", timestamps: false }
);
User_LanguageSchema.index({ userId: 1, languageSymbol: 1 }, { unique: true });

User_LanguageSchema.methods.toJSON = function () {
    const userLanguage = this.toObject();
    delete userLanguage.__v;
    return userLanguage;
};

const UserLanguage = mongoose.model("UserLanguage", User_LanguageSchema);

module.exports = UserLanguage;
