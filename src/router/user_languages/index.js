const { userAuth } = require("../../middleware/auth");
const UserLanguageControler = require("../../controler/user_languages");
const router = require("express").Router();

router.get("/", userAuth, UserLanguageControler.getUserLanguages);

router.post("/", userAuth, UserLanguageControler.createUserLanguage);

module.exports = router;
