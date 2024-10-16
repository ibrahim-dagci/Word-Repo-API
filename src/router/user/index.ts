import express from "express";
import {
    Middleware
} from "../../middleware/types";
import {
    Auth
} from "../../middleware";
import {
    getCurrentUser,
    getAllUser,
    userUpdate,
    userDelete,
    signIn,
    signUp
} from "../../controler/user";

const router = express.Router();

router.get("/", Auth.userAuth, getAllUser);

router.get("/me", Auth.userAuth, getCurrentUser as Middleware);

router.post("/signUp", signUp);

router.post("/signIn", signIn);

router.patch("/me", Auth.userAuth, userUpdate as Middleware);

router.delete("/me", Auth.userAuth, userDelete as Middleware);

export default router
