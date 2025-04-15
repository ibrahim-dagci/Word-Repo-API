import userWordModelCreater from "../../model/user_word";
import ChatbotService from "../../service/chatbot";
import wordModelCreater from "../../model/word";
import meanModelCreater from "../../model/mean";
import createHttpError from "http-errors";
import {
    CustomMiddleware
} from "../../middleware/types";
import mongoose from "mongoose";

const chatbot_service = new ChatbotService()

const chatbot: CustomMiddleware = async (req, res, next) => {
    try {
        const {
            userInput,
            language
        } = req.body;

        const user = req.user;

        if (typeof userInput === "string" && typeof language === "string") {
            let { lan1, lan2 } = {
                lan1: language,
                lan2: user.primaryLanguage
            };
            if (lan1.localeCompare(lan2) > 0) {
                [lan1, lan2] = [lan2, lan1];
            }
            const WordModelCurrent = wordModelCreater(lan1);
            const WordModelPrimary = wordModelCreater(lan2);
            const MeanModel = meanModelCreater(lan1, lan2);
            const UserWordModel = userWordModelCreater(lan1, lan2);

            // 1. Rastgele 5 kaydın ID'sini çekiyoruz
            const randomDocs = await UserWordModel.aggregate([
                { $match: { userId: new mongoose.Types.ObjectId(user._id) } },
                { $sample: { size: 5 } }
            ]);

            const ids = randomDocs.map(doc => doc._id);

            // 2. Bu ID'lerle populate'lı find yapıyoruz
            const randomWords = await UserWordModel.find({ _id: { $in: ids } }).populate({
                path: "meanId",
                select: "-__v",
                populate: [
                    {
                        path: "lan1",
                        model: `${lan1}Word`,
                        select: "-__v",
                    },
                    {
                        path: "lan2",
                        model: `${lan2}Word`,
                        select: "-__v",
                    },
                ],
            }) as any;
            let words = []
            if (language.localeCompare(user.primaryLanguage) > 0) {
                words = randomWords.map((mean: any) => {
                    return mean.meanId.lan2.word;
                })
            }
            else {
                words = randomWords.map((mean: any) => {
                    return mean.meanId.lan1.word;
                })
            }

            const botResponse = await chatbot_service.chatbot(user._id, userInput, language, words);
            botResponse ? res.send(botResponse) : next(createHttpError(500, "chatbot subservice error"));
        }
        else {
            next(createHttpError(400, "Bad Request"));
        }
    } catch (err) {
        console.log(err)
        next(createHttpError(500, "chatbot error"));
    }
};

export {
    chatbot
}