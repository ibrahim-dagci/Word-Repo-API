import dotenv from "dotenv";
import Redis from "ioredis";
import path from "path";

dotenv.config({
    path: path.join(__dirname, "..", "..", "config", "env", "config.env")
});

export default class CacheService extends Redis {
    constructor() {
        super()
    }

    async isThereAnyData(word: string) {
        const data = await this.get(word.toLocaleLowerCase());
        return data ? true : false;
    }
}