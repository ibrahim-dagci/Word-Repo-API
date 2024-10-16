import express from "express";
import {
    Auth
} from "../../middleware";
import {
    Middleware,
} from "../../middleware/types";
import {
    adminSignIn,
    adminSignUp,
    adminUpdate,
    adminDelete,
} from "../../controler/admin";

const router = express.Router();

router.post("/signUp", adminSignUp);

router.post("/signIn", adminSignIn);

router.patch("/me", Auth.adminAuth, adminUpdate as Middleware);

router.delete("/me", Auth.adminAuth, adminDelete as Middleware);

export default router

