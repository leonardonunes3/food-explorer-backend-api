const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const DishesController = require("../controllers/DishesController");
const ensureAuthentication = require("../middlewares/ensureAuthentication");
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization");

const dishesRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const dishesController = new DishesController();

dishesRoutes.use(ensureAuthentication);

dishesRoutes.post("/", upload.single("dish_image"), verifyUserAuthorization("admin"), dishesController.create);
dishesRoutes.get("/:id", dishesController.show);
dishesRoutes.delete("/:id", verifyUserAuthorization("admin"), dishesController.delete);
dishesRoutes.get("/:category?", dishesController.index);
dishesRoutes.put("/:id", upload.single("dish_image"), verifyUserAuthorization("admin"), dishesController.update);

module.exports = dishesRoutes;