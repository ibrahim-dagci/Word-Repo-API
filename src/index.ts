import mongoose from "mongoose";
import express from 'express';
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


//creating app
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
    .connect("mongodb://localhost/wrdb")
    .then(() => console.log("connected to db"))
    .catch((err) => console.log("db connection error: " + err));



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

app.listen(3000, () => {
    console.log("running on 'localhost:3000'");
});
