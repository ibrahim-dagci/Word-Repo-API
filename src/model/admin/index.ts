import createError from "http-errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose, {
    Document,
    Schema,
    Model
} from "mongoose";


interface IAdmin extends Document {
    userName: string;
    email: string;
    password: string;
    generateToken(): Promise<string>;
    toJSON(): IAdmin;
}

interface IAdminModel extends Model<IAdmin> {
    signIn(email: string, password: string): Promise<IAdmin>;
}

const AdminSchema: Schema<IAdmin> = new Schema(
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
    },
    { collection: "admins", timestamps: true }
);

AdminSchema.statics.signIn = async function (email: string, password: string): Promise<IAdmin> {
    const admin = await this.findOne({ email: email });
    if (!admin) {
        throw createError(400, "incorrect entry");
    }

    const passwordControl = await bcrypt.compare(password, admin.password);
    if (!passwordControl) {
        throw createError(400, "incorrect email or password entry");
    }
    return admin;
};

AdminSchema.methods.toJSON = function (): IAdmin {
    const admin = this.toObject();
    delete admin.createdAt;
    delete admin.updatedAt;
    delete admin.password;
    delete admin.__v;
    return admin;
};

AdminSchema.methods.generateToken = async function (): Promise<string> {
    const admin = this
    const { JWT_ADMIN_SECRET_KEY, JWT_ADMIN_EXPIRE } = process.env;
    const token = jwt.sign(
        {
            _id: admin._id,
            userName: admin.userName,
        },
        JWT_ADMIN_SECRET_KEY,
        { expiresIn: JWT_ADMIN_EXPIRE }
    );
    return token;
};

const Admin = mongoose.model<IAdmin, IAdminModel>("Admin", AdminSchema);

export default Admin;
