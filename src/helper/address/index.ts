import dotenv from "dotenv";
import path, { join } from "path";

dotenv.config({
    path: path.join(__dirname, "..", "..", "config", "env", "config.env")
});

const base_url = process.env.SELF_ADDRESS
const voices_path = process.env.VOICE_STATIC_PATH

export const getVoiceAddress = (fileName: string): URL => {
    return new URL(join(base_url, voices_path, fileName))
}