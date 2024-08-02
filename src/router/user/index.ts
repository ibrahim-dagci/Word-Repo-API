import express from "express";
import {
    Middleware
} from "../../middleware/types";
import {
    userAuth
} from "../../middleware/auth";
import {
    getCurrentUser,
    getAllUser,
    userUpdate,
    userDelete,
    signIn,
    signUp
} from "../../controler/user";

const router = express.Router();

router.get("/", userAuth, getAllUser);

router.get("/me", userAuth, getCurrentUser as Middleware);

router.post("/signUp", signUp);

router.post("/signIn", signIn);

router.patch("/me", userAuth, userUpdate as Middleware);

router.delete("/me", userAuth, userDelete as Middleware);

export default router
