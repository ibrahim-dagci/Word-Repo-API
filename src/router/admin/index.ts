import express from "express";
import {
    adminAuth,
} from "../../middleware/auth";
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

router.patch("/me", adminAuth, adminUpdate as Middleware);

router.delete("/me", adminAuth, adminDelete as Middleware);

export default router

