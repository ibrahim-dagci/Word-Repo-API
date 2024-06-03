const mongoose = require("mongoose");

const schema = mongoose.Schema;

const wordModelCreater = (languageSymbol, modelName) => {
    const WordSchema = new schema(
        {
            word: {
                type: String,
                required: true,
                trim: true,
                unique: true,
            },
        },
        { collection: `${languageSymbol}_words`, timestamps: false }
    );

    WordSchema.methods.toJSON = function () {
        const word = this.toObject();
        delete word.__v;
        return word;
    };

    const Word = mongoose.model(modelName, WordSchema);

    return Word;
};

module.exports = wordModelCreater;
