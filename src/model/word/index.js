const mongoose = require("mongoose");

const schema = mongoose.Schema;

const wordModelCreater = (language) => {
    const modelName = `${language}Word`;

    // Modelin zaten tanımlanıp tanımlanmadığını kontrol edin
    if (mongoose.models[modelName]) {
        return mongoose.models[modelName];
    }
    const WordSchema = new schema(
        {
            word: {
                lowercase: true,
                required: true,
                type: String,
                unique: true,
                trim: true,
            },
        },
        { collection: `${language}_words`, timestamps: false }
    );

    WordSchema.methods.toJSON = function () {
        const word = this.toObject();
        delete word.__v;
        return word;
    };

    const Word = mongoose.model(`${language}Word`, WordSchema);

    return Word;
};

module.exports = wordModelCreater;
