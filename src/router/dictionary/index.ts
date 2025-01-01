import express from "express";
import {
    Auth
} from "../../middleware";
import {
    getPronunciation
} from "../../controler/dictionary";

const router = express.Router();

router.get("/pronunciations/:word", getPronunciation);

export default router;