import mongoose, {
    Document,
    Schema,
} from 'mongoose';

interface IUserLanguage extends Document {
    userId: string;
    languageSymbol: string;
    toJSON(): IUserLanguage;
}

const UserLanguageSchema: Schema<IUserLanguage> = new Schema(
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

UserLanguageSchema.index({ userId: 1, languageSymbol: 1 }, { unique: true });

UserLanguageSchema.methods.toJSON = function (): IUserLanguage {
    const userLanguage = this.toObject();
    delete userLanguage.__v;
    return userLanguage;
};

const UserLanguage = mongoose.model<IUserLanguage>("UserLanguage", UserLanguageSchema);

export default UserLanguage;

