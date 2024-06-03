const { adminAuth } = require("../../middleware/auth");
const AdminControler = require("../../controler/admin");
const router = require("express").Router();

router.post("/signUp", AdminControler.adminSignUp);

router.post("/signIn", AdminControler.adminSignIn);

router.patch("/me", adminAuth, AdminControler.adminUpdate);

router.delete("/me", adminAuth, AdminControler.adminDelete);

module.exports = router;
