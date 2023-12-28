const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const DishesController = require("../controllers/DishesController");
const ensureAuthentication = require("../middlewares/ensureAuthentication");

const dishesRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const dishesController = new DishesController();

dishesRoutes.use(ensureAuthentication);

dishesRoutes.post("/", upload.single("dish_image"), dishesController.create);
dishesRoutes.get("/:id", dishesController.show);
dishesRoutes.delete("/:id", dishesController.delete);
dishesRoutes.get("/:category?", dishesController.index);
dishesRoutes.put("/:id", upload.single("dish_image"), dishesController.update);

module.exports = dishesRoutes;