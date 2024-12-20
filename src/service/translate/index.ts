import * as deepl from 'deepl-node';
import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.join(__dirname, "..", "..", "config", "env", "config.env")
});

export default class TranslateService extends deepl.Translator {
    constructor() {
        super(process.env.DEEPL_AUTH_KEY);
    }

    async meanVerify(
        word: string,
        mean: string,
        sourceLanguage: any,
        targetLanguage: any
    ): Promise<boolean> {
        return this.translateText(word, sourceLanguage, targetLanguage).then((response) => {
            return (response.text.toLowerCase() == mean.toLowerCase()
                && response.detectedSourceLang === sourceLanguage) ? true : false
        }).catch((err) => {
            console.error(`translate fetch error: ${err}`);
            return false
        });
    }
}