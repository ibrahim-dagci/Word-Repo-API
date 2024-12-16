import createHttpError from "http-errors";
import multer from "multer";
import path from "path";
import {
    v4
} from "uuid";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", "..", "..", "uploads", "voices"));
    },
    filename: function (req, file, cb) {
        const uniqueFilename = `${v4()}${path.extname(file.originalname)}`;
        cb(null, uniqueFilename);
    },
});

const fileFilter = (req: any, file: any, cb: any) => {
    const allowedMimeTypes = ["audio/x-m4a", "audio/x-mp3"];
    allowedMimeTypes.includes(file.mimetype) ?
        cb(null, true) : cb(createHttpError("invalid file type"), false);
};


const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
});

export default upload