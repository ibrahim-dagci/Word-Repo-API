import UserLanguage from "../../model/user_language";
import Language from "../../model/language";
import createError from "http-errors";
import {
    CustomMiddleware,
} from "../../middleware/types";

const getUserLanguages: CustomMiddleware = async (req, res, next) => {
    try {
        const allLanguages = await Language.find({});
        const userLanguages = await UserLanguage.find({ userId: req.user._id });
        const filteredLanguages = allLanguages.filter((user) => {
            return userLanguages.find(
                (userLanguage) => userLanguage.languageSymbol === user.symbol
            );
        });
        return res.send(filteredLanguages);
    } catch (err: any) {
        console.log(err.message)
        next(createError(500, "languages fetch error"));
    }
};

const createUserLanguage: CustomMiddleware = async (req, res, next) => {
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
        next(createError(500, "language create error"));
    }
};

export {
    getUserLanguages,
    createUserLanguage,
};
