const { userAuth } = require("../../middleware/auth");
const UserControler = require("../../controler/user");
const router = require("express").Router();

router.get("/", userAuth, UserControler.getAllUser);

router.get("/me", userAuth, UserControler.getCurrentUser);

router.post("/signUp", UserControler.signUp);

router.post("/signIn", UserControler.signIn);

router.patch("/me", userAuth, UserControler.userUpdate);

router.delete("/me", userAuth, UserControler.userDelete);

module.exports = router;
