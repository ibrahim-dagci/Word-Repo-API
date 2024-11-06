import express from 'express';
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import {
    userLanguageRouter,
    userWordRouter,
    languageRouter,
    adminRouter,
    userRouter,
} from "./router";
import {
    ErrorCatcher,
    Auth,
} from "./middleware";
import {
    connectDatabase
} from './helper/database';

//Environment variables
dotenv.config({
    path: path.join(__dirname, "config", "env", "config.env")
});

//Database Connection
connectDatabase();

//creating app
const app = express();
const PORT = process.env.Port || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// statics
app.use(
    "/api/statics/languages",
    express.static(path.join(__dirname, "..", "statics", "language_images"))
);
app.use(
    "/api/uploads/voices",
    Auth.userAuth,
    express.static(path.join(__dirname, "..", "uploads", "voices"))
);

//routing
app.use("/api/user_languages", userLanguageRouter);
app.use("/api/user_words", userWordRouter);
app.use("/api/languages", languageRouter);
app.use("/api/admins", adminRouter);
app.use("/api/users", userRouter);

//endpoint
app.use(ErrorCatcher);

app.listen(PORT, () => {
    console.log("running on 'localhost:3000'");
});
