const mongoose = require("mongoose");

const schema = mongoose.Schema;

const meanModelCreater = (language1, language2) => {
    // string1'in string2'den önce gelip gelmediğini kontrol etmek için localeCompare kullanılır
    if (language1.localeCompare(language2) > 0) {
        [language1, language2] = [language2, language1];
    }
    const modelName = `${language1}_${language2}Mean`;

    // Modelin zaten tanımlanıp tanımlanmadığını kontrol edin
    if (mongoose.models[modelName]) {
        return mongoose.models[modelName];
    }
    const MeanSchema = new schema(
        {
            lan1: {
                type: schema.Types.ObjectId,
                ref: `${language1}Word`,
                required: true,
                trim: true,
            },
            lan2: {
                type: schema.Types.ObjectId,
                ref: `${language2}Word`,
                required: true,
                trim: true,
            },
        },
        { collection: `${language1}_${language2}_means`, timestamps: false }
    );
    MeanSchema.index({ lan1: 1, lan2: 1 }, { unique: true });

    MeanSchema.methods.toJSON = function () {
        const mean = this.toObject();
        delete mean.__v;
        return mean;
    };

    const Mean = mongoose.model(`${language1}_${language2}Mean`, MeanSchema);

    return Mean;
};

module.exports = meanModelCreater;
