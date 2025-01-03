const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const UsersController = require("../controllers/UsersController");
const UsersAvatarController = require("../controllers/UserAvatarController");
const ensureAuthentication = require("../middlewares/ensureAuthentication");

const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const usersController = new UsersController();
const usersAvatarController = new UsersAvatarController();

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthentication, usersController.update);
usersRoutes.patch("/avatar", ensureAuthentication, upload.single("avatar"), usersAvatarController.update);
usersRoutes.get("/validated", ensureAuthentication, usersController.index);

module.exports = usersRoutes;