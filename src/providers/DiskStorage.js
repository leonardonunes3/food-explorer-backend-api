const fs = require("fs");
const path = require("path");
const uploadConfig = require("../configs/upload");

class DiskStorage {
    async saveAvatarFile(file) {
        await fs.promises.rename(
            path.resolve(uploadConfig.TMP_FOLDER, file),
            path.resolve(uploadConfig.AVATAR_UPLOADS_FOLDER, file)
        );

        return file;
    }

    async deleteAvatarFile(file) {
        const filePath = path.resolve(uploadConfig.AVATAR_UPLOADS_FOLDER, file);

        try {
            await fs.promises.stat(filePath);
        } catch {
            return;
        }

        await fs.promises.unlink(filePath);
    }

    async saveDishesFile(file) {
        await fs.promises.rename(
            path.resolve(uploadConfig.TMP_FOLDER, file),
            path.resolve(uploadConfig.DISHES_UPLOADS_FOLDER, file)
        );

        return file;
    }

    async deleteDishesFile(file) {
        const filePath = path.resolve(uploadConfig.DISHES_UPLOADS_FOLDER, file);

        try {
            await fs.promises.stat(filePath);
        } catch {
            return;
        }

        await fs.promises.unlink(filePath);
    }
}

module.exports = DiskStorage;