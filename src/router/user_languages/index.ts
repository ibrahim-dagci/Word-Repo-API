import express from "express";
import {
    Auth
} from "../../middleware";
import {
    createUserLanguage,
    getUserLanguages
} from "../../controler/user_languages";

const router = express.Router();

router.get("/", Auth.userAuth, getUserLanguages);

router.post("/", Auth.userAuth, createUserLanguage);

export default router;
