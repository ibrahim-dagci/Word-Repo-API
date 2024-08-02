import mongoose, {
    Document,
    Schema,
    Model
} from 'mongoose';

interface IUserWord extends Document {
    userId: mongoose.Types.ObjectId;
    meanId: mongoose.Types.ObjectId;
    voice?: string;
    toJSON(): IUserWord;
}

const userWordModelCreater = (language1: string, language2: string): Model<IUserWord> => {
    if (language1.localeCompare(language2) > 0) {
        [language1, language2] = [language2, language1];
    }
    const modelName = `${language1}_${language2}UserWord`;

    // Modelin zaten tanımlanıp tanımlanmadığını kontrol edin
    if (mongoose.models[modelName]) {
        return mongoose.models[modelName] as Model<IUserWord>;
    }

    const UserWordSchema: Schema<IUserWord> = new Schema(
        {
            userId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: "User",
            },
            meanId: {
                type: Schema.Types.ObjectId,
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

    UserWordSchema.methods.toJSON = function (): IUserWord {
        const word = this.toObject();
        delete word.__v;
        return word;
    };

    const UserWord = mongoose.model(modelName, UserWordSchema);

    return UserWord;
};

export default userWordModelCreater;

