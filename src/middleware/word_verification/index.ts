import {
    CustomMiddleware
} from "../types";

const word_verification: CustomMiddleware = (req, res, next): void => {
    //Gelen kelime sözlükte var mı yok mu kontrol et varsa 
    // gelen mp3 veya mp4 dosyalarını wav dosyasına çevirme
    // Ses Örnekleme Oranını (Sampling Rate) Sabitleme
    // Mono Kanala Dönüştürme
    // Sessizliği Kesme (Optional) baş ve sondaki sesiz kısımları kesme (trim)
    // MFCC ile özellik çıkarma. 
    // DTW ile karşılaştırma.

    //--------------------- OR ---------------------------------------

    // Whisper modeli kullan
    next();
};

export default word_verification;