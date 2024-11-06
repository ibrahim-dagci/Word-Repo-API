import mongoose from "mongoose";

export const connectDatabase = () => {
    mongoose
        .connect(process.env.MONGO_URI)
        .then(() => console.log("connected to db"))
        .catch((err) => console.log("db connection error: " + err));
}