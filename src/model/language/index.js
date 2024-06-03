const mongoose = require("mongoose");
const schema = mongoose.Schema;

const LanguageSchema = new schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        flagUnicode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        symbol: {
            type: String,
            lowercase: true,
            required: true,
            unique: true,
            trim: true,
        },
        imgUrl: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
    },
    { collection: "languages", timestamps: false }
);

LanguageSchema.methods.toJSON = function () {
    const language = this.toObject();
    delete language._id;
    delete language.__v;
    return language;
};

const Language = mongoose.model("Language", LanguageSchema);

module.exports = Language;
