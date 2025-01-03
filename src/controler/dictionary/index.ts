import createHttpError from "http-errors";
import EnglishDictionaryService from "../../service/dictionary";
import TranslateService from "../../service/translate";
import {
    Middleware
} from "../../middleware/types";
import {
    SourceLanguageCode,
    TargetLanguageCode
} from "deepl-node";

const dictionary_service = new EnglishDictionaryService();
const translate_service = new TranslateService();

const getWordData: Middleware = async (req, res, next) => {
    try {
        const {
            word,
            sourceLanguage,
            targetLanguage
        } = req.params;
        if (word && sourceLanguage && targetLanguage) {
            const voice_array = await dictionary_service.getWordPronunciations(word)
            const mean = await translate_service.translateText(word.toLocaleLowerCase(), sourceLanguage as SourceLanguageCode, targetLanguage as TargetLanguageCode);
            res.status(200);
            res.send({
                message: "succes",
                data: {
                    mean: mean.text,
                    voices: voice_array
                },
                code: 200
            })
        }
        else {
            next(createHttpError(400, "Bad Request"))
        }
    } catch {
        next(createHttpError(500, "pronunciation fetch error"));
    }
};

export {
    getWordData
}