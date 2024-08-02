import express from "express";
import {
    userAuth
} from "../../middleware/auth";
import {
    createUserLanguage,
    getUserLanguages
} from "../../controler/user_languages";

const router = express.Router();

router.get("/", userAuth, getUserLanguages);

router.post("/", userAuth, createUserLanguage);

export default router;
