import axios, { AxiosResponse } from "axios";
import { error } from "console";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.join(__dirname, "..", "..", "config", "env", "config.env")
});

interface Phonetic {
    text?: string;
    audio?: string;
    sourceUrl?: string;
    license?: {
        name: string;
        url: string;
    };
}

interface Meaning {
    partOfSpeech: string;
    definitions: {
        definition: string;
        synonyms: string[];
        antonyms: string[];
        example?: string;
    }[];
    synonyms: string[];
    antonyms: string[];
}

interface WordResponse {
    word: string;
    phonetics: Phonetic[];
    meanings: Meaning[];
    license: {
        name: string;
        url: string;
    };
    sourceUrls: string[];
}

export default class EnglishDictionaryService {
    private baseUrl: string;
    constructor() {
        this.baseUrl = process.env.ENGLISH_DICTIONARY_SERVICE_ADDRESS;
    }

    async getWordPronunciations(word: string): Promise<URL[]> {
        return await axios.get(`${this.baseUrl}/api/v2/entries/en/${word.toLowerCase()}`)
            .then((response: AxiosResponse<WordResponse[]>) => {
                let phonetics: URL[] = [];
                response.data[0].phonetics.map((phonetic) => {
                    if (phonetic.audio !== "") phonetics.push(new URL(phonetic.audio));
                })
                return phonetics;
            }).catch((err) => {
                console.error(`phonetics fetch error: ${err}`);
                const phonetics: URL[] = []
                return phonetics;
            });
    }
}