import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose, {
    Document,
    Schema,
    Model
} from 'mongoose';

interface IUser extends Document {
    userName: string;
    email: string;
    password: string;
    primaryLanguage: string;
    generateToken(): Promise<string>;
    toJSON(): IUser;
}

interface IUserModel extends Model<IUser> {
    signIn(email: string, password: string): Promise<IUser>;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        userName: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        primaryLanguage: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
    },
    { collection: "users", timestamps: true }
);

UserSchema.statics.signIn = async function (email: string, password: string): Promise<IUser> {
    const user = await this.findOne({ email });
    if (!user) {
        throw createError(400, "incorrect entry");
    }

    const passwordControl = await bcrypt.compare(password, user.password);

    if (!passwordControl) {
        throw createError(400, "incorrect email or password entry");
    }
    return user;
};

UserSchema.methods.toJSON = function (): IUser {
    const user = this.toObject();
    delete user.createdAt;
    delete user.updatedAt;
    delete user.password;
    delete user.__v;
    return user;
};

UserSchema.methods.generateToken = async function (): Promise<string> {
    const user = this as IUser;
    const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;
    const token = await jwt.sign(
        {
            _id: user._id,
            userName: user.userName,
            primaryLanguage: user.primaryLanguage,
        },
        JWT_SECRET_KEY,
        { expiresIn: JWT_EXPIRE }
    );
    return token;
};

const User = mongoose.model<IUser, IUserModel>("User", UserSchema);

export default User;

