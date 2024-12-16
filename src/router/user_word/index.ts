import express from "express";
import {
    createUserWord,
    getUserWords
} from "../../controler/user_word";
import {
    WordVerification,
    Auth,
} from "../../middleware";
import upload from "../../helper/file";


const router = express.Router();

router.post("/get", Auth.userAuth, getUserWords,);

router.post(
    "/create",
    Auth.userAuth,
    upload.single("audio"),
    WordVerification,
    createUserWord,
);

export default router
