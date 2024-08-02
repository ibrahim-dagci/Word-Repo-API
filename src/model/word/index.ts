import mongoose, {
    Document,
    Schema,
    Model
} from 'mongoose';

interface IWord extends Document {
    word: string;
    toJSON(): IWord;
}

const wordModelCreater = (language: string): Model<IWord> => {
    const modelName = `${language}Word`;

    // Modelin zaten tanımlanıp tanımlanmadığını kontrol edin
    if (mongoose.models[modelName]) {
        return mongoose.models[modelName] as Model<IWord>;
    }

    const WordSchema: Schema<IWord> = new Schema(
        {
            word: {
                type: String,
                lowercase: true,
                required: true,
                unique: true,
                trim: true,
            },
        },
        { collection: `${language}_words`, timestamps: false }
    );

    WordSchema.methods.toJSON = function (): IWord {
        const word = this.toObject();
        delete word.__v;
        return word;
    };

    const Word = mongoose.model(modelName, WordSchema);

    return Word;
};

export default wordModelCreater;

