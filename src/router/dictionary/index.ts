import express from "express";
import {
    Auth
} from "../../middleware";
import {
    getWordData
} from "../../controler/dictionary";

const router = express.Router();

router.get("/:word/:sourceLanguage/:targetLanguage", getWordData);

export default router;