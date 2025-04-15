import dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";
import path from "path";
import { error } from "console";

type CompareResponse = {
    DWTdistance: number,
    verificationRate: number
}

type ConvertResponse = {
    language: string,
    text: string
}

dotenv.config({
    path: path.join(__dirname, "..", "..", "config", "env", "config.env")
});

export default class VoiceVerificationService {
    private baseUrl: string;
    constructor() {
        this.baseUrl = process.env.SUB_SERVICE_ADDRESS;
    }

    async compareVoicesVerify(url1: URL, url2: URL): Promise<boolean> {
        const data = {
            url1: url1.href,
            url2: url2.href
        }
        return await axios.post(`${this.baseUrl}/api/voice_verify/compare`, data)
            .then((response: AxiosResponse<CompareResponse>) => {
                console.log(response.data.verificationRate);
                return response.data.verificationRate > 80 ? true : false
            }).catch((err) => {
                console.error(`DWT compare request error: ${err}`);
                return false
            });
    }

    async converToTextVerify(word: string, url: URL, language: string): Promise<boolean> {
        const data = {
            url: url.href,
            language
        }
        return axios.post(`${this.baseUrl}/api/voice_verify/convert_to_text`, data)
            .then((response: AxiosResponse<ConvertResponse>) => {
                if (response.data.language == language && response.data.text == word.toLowerCase()) {
                    return true
                }
                return false
            }).catch((err) => {
                console.error(`whisper convert request error: ${err}`);
                return false
            })
    }
}