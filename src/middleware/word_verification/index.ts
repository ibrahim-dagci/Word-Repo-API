import VoiceVerificationService from "../../service/voice_verify";
import EnglishDictionaryService from "../../service/dictionary";
import TranslateService from "../../service/translate";
import { getVoiceAddress } from "../../helper/address";
import createHttpError from "http-errors";
import fs from "fs";
import {
    CustomMiddleware
} from "../types";
import CacheService from "../../service/cache";

const translateService = new TranslateService();
const voiceVerification = new VoiceVerificationService();
const dictionaryService = new EnglishDictionaryService();
const cacheService = new CacheService();

const word_verification: CustomMiddleware = async (req, res, next): Promise<void> => {
    const {
        wordData
    } = req.body;

    const {
        filename,
        path
    } = req.file;

    const {
        primaryLanguage,
        currentLanguage,
        word,
        mean
    }: {
        primaryLanguage: any,
        currentLanguage: any,
        word: string,
        mean: string,
    } = JSON.parse(wordData);
    try {
        const url1 = getVoiceAddress(filename);
        const url2 = await dictionaryService.getWordPronunciations(word)
        const mean_verification_status = await translateService
            .meanVerify(word, mean, currentLanguage, primaryLanguage);
        let voice_verification_status = false;
        console.log(mean_verification_status);

        const isRepeateingData = await cacheService.isThereAnyData(word);
        if (url2.length > 0 && !isRepeateingData) {
            cacheService.set(`${word.toLowerCase()}`, word.toLowerCase(), "EX", 60);
            console.log("DWT doğruluyor")
            voice_verification_status = await voiceVerification
                .compareVoicesVerify(url1, url2[0]);
        }
        else {
            console.log("Whisper doğruluyor")
            voice_verification_status = await voiceVerification
                .converToTextVerify(word, url1, currentLanguage);
        }
        if (voice_verification_status) {
            req.body.wordData = {
                isVerified: mean_verification_status,
                primaryLanguage,
                currentLanguage,
                word,
                mean
            }
            next()
        }
        else {
            try {
                fs.unlink(path, (err) => {
                    if (err) {
                        console.error(`Dosya silinirken bir hata oluştu: ${err}`);
                    }
                });
                next(createHttpError(422, "pronunciation could not be verified"));
            }
            catch (err) {
                next(createHttpError(500, "server error"));
            }

        }
    }
    catch {
        try {
            fs.unlink(path, (err) => {
                if (err) {
                    console.error(`Dosya silinirken bir hata oluştu: ${err}`);
                }
            });
            next(createHttpError(500, "word could not be verified"));
        }
        catch (err) {
            next(createHttpError(500, "server error"));
        }
    }
};

export default word_verification;