const errorCatcherMiddleware = require("./src/middleware/error");
const { userAuth } = require("./src/middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const cors = require("cors");

//creating app
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
    .connect("mongodb://localhost/wrdb")
    .then(() => console.log("connected to db"))
    .catch((err) => console.log("db connection error: " + err));

//Routes
const userLanguageRouter = require("./src/router/user_languages");
const userWordRouter = require("./src/router/user_word");
const languageRouter = require("./src/router/language");
const adminRouter = require("./src/router/admin");
const userRouter = require("./src/router/user");

// statics
app.use(
    "/api/statics/languages",
    express.static(path.join(__dirname, "statics", "language_images"))
);
app.use(
    "/api/uploads/voices",
    userAuth,
    express.static(path.join(__dirname, "uploads", "voices"))
);

//routing
app.use("/api/user_languages", userLanguageRouter);
app.use("/api/user_words", userWordRouter);
app.use("/api/languages", languageRouter);
app.use("/api/admins", adminRouter);
app.use("/api/users", userRouter);

//endpoint
app.use(errorCatcherMiddleware);

app.listen(3000, () => {
    console.log("running on 'localhost:3000'");
});
