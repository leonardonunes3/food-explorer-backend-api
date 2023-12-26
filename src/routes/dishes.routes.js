const { Router } = require("express");

const DishesController = require("../controllers/DishesController");
const ensureAuthentication = require("../middlewares/ensureAuthentication");

const dishesRoutes = Router();

const dishesController = new DishesController();

dishesRoutes.use(ensureAuthentication);

dishesRoutes.post("/:user_id", dishesController.create);
dishesRoutes.get("/:id", dishesController.show);
dishesRoutes.delete("/:id", dishesController.delete);
dishesRoutes.get("/:category?", dishesController.index);
dishesRoutes.put("/:id", dishesController.update);

module.exports = dishesRoutes;