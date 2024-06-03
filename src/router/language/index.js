const { adminAuth } = require("../../middleware/auth");
const LanguageControler = require("../../controler/language");
const router = require("express").Router();

router.get("/", LanguageControler.getAllLanguages);

router.post("/", adminAuth, LanguageControler.createLanguage);

router.patch("/:id", adminAuth, LanguageControler.updateLanguage);

router.delete("/:id", adminAuth, LanguageControler.deleteLanguage);

module.exports = router;
