import express from "express";
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

router.get("/me", Auth.userAuth, getCurrentUser);

router.post("/signUp", signUp);

router.post("/signIn", signIn);

router.patch("/me", Auth.userAuth, userUpdate);

router.delete("/me", Auth.userAuth, userDelete);

export default router
