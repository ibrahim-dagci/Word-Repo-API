import express from "express";
import {
    Auth
} from "../../middleware";
import {
    chatbot
} from "../../controler/chatbot";

const router = express.Router();

router.post("/", Auth.userAuth, chatbot);

export default router;