const mongoose = require("mongoose");

const schema = mongoose.Schema;

const userWordModelCreater = (language1, language2) => {
    if (language1.localeCompare(language2) > 0) {
        [language1, language2] = [language2, language1];
    }
    const modelName = `${language1}_${language2}UserWord`;

    // Modelin zaten tanımlanıp tanımlanmadığını kontrol edin
    if (mongoose.models[modelName]) {
        return mongoose.models[modelName];
    }
    const UserWordSchema = new schema(
        {
            userId: {
                type: schema.Types.ObjectId,
                required: true,
                ref: "User",
            },
            meanId: {
                type: schema.Types.ObjectId,
                ref: `${language1}_${language2}Mean`,
                required: true,
            },
            voice: {
                type: String,
                unique: true,
                trim: true,
            },
        },
        {
            collection: `${language1}_${language2}_user_words`,
            timestamps: false,
        }
    );
    UserWordSchema.index({ userId: 1, meanId: 1 }, { unique: true });

    UserWordSchema.methods.toJSON = function () {
        const word = this.toObject();
        delete word.__v;
        return word;
    };

    const UserWord = mongoose.model(
        `${language1}_${language2}UserWord`,
        UserWordSchema
    );

    return UserWord;
};

module.exports = userWordModelCreater;
