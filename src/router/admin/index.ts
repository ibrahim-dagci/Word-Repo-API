import express from "express";
import {
    Auth
} from "../../middleware";
import {
    adminSignIn,
    adminSignUp,
    adminUpdate,
    adminDelete,
} from "../../controler/admin";

const router = express.Router();

router.post("/signUp", adminSignUp);

router.post("/signIn", adminSignIn);

router.patch("/me", Auth.adminAuth, adminUpdate);

router.delete("/me", Auth.adminAuth, adminDelete);

export default router

