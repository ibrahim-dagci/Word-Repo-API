import express from "express";
import multer from "multer";
import path from "path";
import {
    v4
} from "uuid";
import {
    createUserWord,
    getUserWords
} from "../../controler/user_word";
import {
    userAuth,
} from "../../middleware/auth";
import {
    Middleware
} from "../../middleware/types";


const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", "..", "..", "uploads", "voices"));
    },
    filename: function (req, file, cb) {
        const uniqueFilename = `${v4()}.mp4`;
        cb(null, uniqueFilename);
    },
});

const upload = multer({ storage: storage });

router.post("/get", userAuth, getUserWords as Middleware);

router.post(
    "/create",
    userAuth,
    upload.single("audio"),
    createUserWord as Middleware
);

export default router
