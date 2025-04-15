import dotenv from "dotenv";
import axios, {
    AxiosResponse
} from "axios";
import path from "path";

type ChatbotResponse = {
    botResponse: string;
}

dotenv.config({
    path: path.join(__dirname, "..", "..", "config", "env", "config.env")
});

export default class ChatbotService {
    private baseUrl: string;
    constructor() {
        this.baseUrl = process.env.SUB_SERVICE_ADDRESS;
    }

    async chatbot(userID: string, userInput: string, userLanguage: string, userWords: string[]): Promise<ChatbotResponse | boolean> {
        const data = {
            userLanguage: userLanguage,
            userInput: userInput,
            words: userWords,
            userID: userID
        }
        return await axios.post(`${this.baseUrl}/api/chatbot`, data)
            .then((response: AxiosResponse<ChatbotResponse>) => {
                return response.data
            }).catch((err) => {
                console.error(`DWT compare request error: ${err}`);
                return false
            });
    }
}