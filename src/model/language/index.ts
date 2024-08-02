import mongoose, {
    Document,
    Schema,
    Model
} from 'mongoose';

interface ILanguage extends Document {
    name: string;
    flagUnicode: string;
    symbol: string;
    imgUrl: string;
    toJSON(): ILanguage;
}

const LanguageSchema: Schema<ILanguage> = new Schema(
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

LanguageSchema.methods.toJSON = function (): ILanguage {
    const language = this.toObject();
    delete language._id;
    delete language.__v;
    return language;
};

const Language = mongoose.model("Language", LanguageSchema);

export default Language;

