import express from "express";
import {
    Auth
} from "../../middleware";
import {
    getAllLanguages,
    createLanguage,
    deleteLanguage,
    updateLanguage
} from "../../controler/language";

const router = express.Router();

router.get("/", getAllLanguages);

router.post("/", Auth.adminAuth, createLanguage);

router.patch("/:id", Auth.adminAuth, updateLanguage);

router.delete("/:id", Auth.adminAuth, deleteLanguage);

export default router
