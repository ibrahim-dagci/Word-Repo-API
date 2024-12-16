import userWordModelCreater from "../../model/user_word";
import wordModelCreater from "../../model/word";
import meanModelCreater from "../../model/mean";
import createError from "http-errors";
import mongoose from "mongoose";
import fs from "fs";
import {
    CustomMiddleware,
    Middleware,
} from "../../middleware/types";

const getUserWords: CustomMiddleware = async (req, res, next) => {
    let { lan1, lan2 } = req.body;
    const { user } = req;
    if (lan1.localeCompare(lan2) > 0) {
        [lan1, lan2] = [lan2, lan1];
    }
    const WordModelCurrent = wordModelCreater(lan1);
    const WordModelPrimary = wordModelCreater(lan2);
    const MeanModel = meanModelCreater(lan1, lan2);
    const UserWordModel = userWordModelCreater(lan1, lan2);
    try {
        const userWords = await UserWordModel.find({
            userId: user._id,
        }).populate({
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
        });
        res.send(userWords);
    } catch (err) {
        next(createError(500, "means fetch error"));
    }
};

const createUserWord: CustomMiddleware = async (req, res, next) => {
    const wordData = JSON.parse(req.body.wordData);
    const fileName = req.file.filename; // voice file name
    const filePath = req.file.path; // voice file path
    const WordModelCurrent = wordModelCreater(wordData.currentLanguage);
    const WordModelPrimary = wordModelCreater(wordData.primaryLanguage);
    const MeanModel = meanModelCreater(
        wordData.primaryLanguage,
        wordData.currentLanguage
    );
    const UserWordModel = userWordModelCreater(
        wordData.primaryLanguage,
        wordData.currentLanguage
    );

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // current word insert
        const filterCurrent = { word: wordData.word };
        const updateCurrent = { word: wordData.word };
        const optionsCurrent = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
            runValidators: true,
        };
        const current = await WordModelCurrent.findOneAndUpdate(
            filterCurrent,
            updateCurrent,
            optionsCurrent
        );
        //------------------------------------------------------------------------------------------
        //primary word insert
        const filterPrimary = { word: wordData.mean };
        const updatePrimary = { word: wordData.mean };
        const optionsPrimary = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
            runValidators: true,
        };
        const primary = await WordModelPrimary.findOneAndUpdate(
            filterPrimary,
            updatePrimary,
            optionsPrimary
        );
        //----------------------------------------------------------------------------------------------
        // mean insert
        let realMean;
        if (
            wordData.currentLanguage.localeCompare(wordData.primaryLanguage) > 0
        ) {
            const filterMean = { lan1: primary._id, lan2: current._id };
            const updateMean = { lan1: primary._id, lan2: current._id };
            const optionsMean = {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
                runValidators: true,
            };
            const mean = await MeanModel.findOneAndUpdate(
                filterMean,
                updateMean,
                optionsMean
            );
            realMean = mean;
        } else {
            const filterMean = { lan1: current._id, lan2: primary._id };
            const updateMean = { lan1: current._id, lan2: primary._id };
            const optionsMean = {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
                runValidators: true,
            };
            const mean = await MeanModel.findOneAndUpdate(
                filterMean,
                updateMean,
                optionsMean
            );
            realMean = mean;
        }
        //------------------------------------------------------------------------
        //user word insert
        await new UserWordModel({
            userId: req.user._id,
            meanId: realMean._id,
            voice: fileName,
        }).save();

        await session.commitTransaction();
        session.endSession();
        res.send({ message: "word created", statusCode: 200, name: "succes" });
    } catch (err) {
        try {
            await session.abortTransaction();
            session.endSession();
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Dosya silinirken bir hata oluştu: ${err}`);
                }
            });
            next(createError(500, "word create error"));
        } catch {
            next(createError(500, "server error"));
        }
    }
};

export {
    createUserWord,
    getUserWords,
};
