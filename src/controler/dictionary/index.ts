import createHttpError from "http-errors";
import { Middleware } from "../../middleware/types";
import EnglishDictionaryService from "../../service/dictionary";

const dictionary_service = new EnglishDictionaryService();

const getPronunciation: Middleware = async (req, res, next) => {
    try {
        const { word } = req.params;
        if (word) {
            const voice_array = await dictionary_service.getWordPronunciations(word)
            res.status(200);
            res.send({
                message: "succes",
                voices: voice_array,
                code: 200
            })
        }
        else {
            next(createHttpError(400, "Bad Request"))
        }
    } catch (err) {
        next(createHttpError(500, "pronunciation fetch error"));
    }
};

export {
    getPronunciation
}