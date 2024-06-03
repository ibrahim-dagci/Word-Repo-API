const Language = require("../../model/language");
const createError = require("http-errors");

const getAllLanguages = async (req, res, next) => {
    try {
        const allLanguages = await Language.find({});
        return res.send(allLanguages);
    } catch (err) {
        next(createError(500, "fetch error", err));
    }
};

const createLanguage = async (req, res, next) => {
    try {
        await new Language(req.body).save();
        return res.send({
            message: "language created",
            statusCode: 200,
            name: "succes",
        });
    } catch (err) {
        next(createError(500, "language create error", err));
    }
};

const updateLanguage = async (req, res, next) => {
    try {
        const updated = await Language.findByIdAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (updated) {
            return res.send(updated);
        } else {
            return res
                .status(404)
                .json({ message: "language not found", statusCode: 404 });
        }
    } catch (err) {
        next(createError(500, "update error", err));
    }
};

const deleteLanguage = async (req, res, next) => {
    try {
        const finded = await Language.findByIdAndDelete(req.params.id);
        if (finded) {
            return res.send(finded);
        } else {
            return res.status(404).json({ message: "user not found" });
        }
    } catch (err) {
        next(createError(500, "delete error", err));
    }
};

module.exports = {
    getAllLanguages,
    createLanguage,
    updateLanguage,
    deleteLanguage,
};
