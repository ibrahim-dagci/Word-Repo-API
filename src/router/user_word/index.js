const UserWordControler = require("../../controler/user_word");
const { userAuth } = require("../../middleware/auth");
const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", "..", "..", "uploads", "voices"));
    },
    filename: function (req, file, cb) {
        const uniqueFilename = `${uuidv4()}.mp4`;
        cb(null, uniqueFilename);
    },
});

const upload = multer({ storage: storage });

router.post("/get", userAuth, UserWordControler.getUserWords);

router.post(
    "/create",
    userAuth,
    upload.single("audio"),
    UserWordControler.createUserWord
);

module.exports = router;
