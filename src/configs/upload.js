const path = require("path");
const multer = require("multer");
const crypto = require("crypto");

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");
const AVATAR_UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads/avatar");
const DISHES_UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads/dishes");

const MULTER = {
    storage: multer.diskStorage({
        destination: TMP_FOLDER,
        filename(request, file, callback) {
            const fileHash = crypto.randomBytes(10).toString("hex");
            const fileName = `${fileHash}-${file.originalname}`;

            return callback(null, fileName);
        },
    }),
};

module.exports = {
    TMP_FOLDER,
    AVATAR_UPLOADS_FOLDER,
    DISHES_UPLOADS_FOLDER,
    MULTER,
}