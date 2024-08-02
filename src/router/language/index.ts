import express from "express";
import {
    adminAuth
} from "../../middleware/auth";
import {
    getAllLanguages,
    createLanguage,
    deleteLanguage,
    updateLanguage
} from "../../controler/language";

const router = express.Router();

router.get("/", getAllLanguages);

router.post("/", adminAuth, createLanguage);

router.patch("/:id", adminAuth, updateLanguage);

router.delete("/:id", adminAuth, deleteLanguage);

export default router
