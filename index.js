const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const errorCatcherMiddleware = require("./src/middleware/error");

//creating app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
    .connect("mongodb://localhost/wrdb")
    .then(() => console.log("connected to db"))
    .catch((err) => console.log("db connection error: " + err));

//Routes
const userLanguageRouter = require("./src/router/user_languages");
const languageRouter = require("./src/router/language");
const adminRouter = require("./src/router/admin");
const userRouter = require("./src/router/user");

// statics
app.use(
    "/api/statics/languages",
    express.static(path.join(__dirname, "statics", "language_images"))
);

//routing
app.use("/api/user_languages", userLanguageRouter);
app.use("/api/languages", languageRouter);
app.use("/api/admins", adminRouter);
app.use("/api/users", userRouter);

//endpoint
app.use(errorCatcherMiddleware);

app.listen(3000, () => {
    console.log("running on 'localhost:3000'");
});
