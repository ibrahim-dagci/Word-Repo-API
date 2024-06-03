const UserLanguage = require("../../model/user_language");
const Language = require("../../model/language");
const createError = require("http-errors");

const getUserLanguages = async (req, res, next) => {
    try {
        const allLanguages = await Language.find({});
        const userLanguages = await UserLanguage.find({ userId: req.user._id });
        const filteredLanguages = allLanguages.filter((user) => {
            return userLanguages.find(
                (userLanguage) => userLanguage.languageSymbol === user.symbol
            );
        });
        return res.send(filteredLanguages);
    } catch (err) {
        next(createError(500, "languages fetch error", err));
    }
};

const createUserLanguage = async (req, res, next) => {
    try {
        const newUserLanguage = new UserLanguage({
            ...req.body,
            userId: req.user._id,
        });
        await newUserLanguage.save();
        return res.send({
            message: "language created",
            statusCode: 200,
            name: "succes",
        });
    } catch (err) {
        next(createError(500, "language create error", err));
    }
};

module.exports = {
    getUserLanguages,
    createUserLanguage,
};
