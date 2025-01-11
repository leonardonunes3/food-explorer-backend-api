const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

const knex = require("../database/knex");

class DishesController {

    async create(request, response) {

        const { name, category, price, description, ingredients } = request.body;
        const user_id = request.user.id;
        const dishFilename = request.file?.filename;

        const diskStorage = new DiskStorage();

        const user = await knex("users").where({ id: user_id }).first();

        if(!user) {
            throw new AppError("Somente usuários autenticados podem criar prato", 401);
        }

        let dish_image = null;

        if(dishFilename) {
            dish_image = await diskStorage.saveDishesFile(dishFilename);
        } 

        const [ dish_id ] = await knex("dishes").insert({
            name,
            category,
            price,
            description,
            dish_image
        });

        const ingredientsInsert = ingredients.map(ingredient => {
            return {
                dish_id,
                name: ingredient
            }
        });

        await knex("ingredients").insert(ingredientsInsert);

        response.status(201).json();
    }

    async show(request, response) {
        const { id } = request.params;

        const dish = await knex("dishes").where({ id }).first();
        if(dish) {
            const ingredients = await knex("ingredients").where({ dish_id: id });

            return response.json({
                ...dish,
                ingredients
            });
        } else {
            return response.json();
        }
        
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex("dishes").where({ id }).delete();

        return response.json();
    }

    async index(request, response) {
        const { category } = request.query;
        const { name } = request.query;

        let dishes;

        if(category) {
            dishes = await knex("dishes").where({ category }).orderBy("price");
        } else {
            if(name) {
                dishes = await knex.raw(`select * from dishes where name like \'%${name}%\' limit 3`);
                dishes.push.apply(dishes, await knex.raw(`select distinct a.* from dishes a, ingredients b where a.id = b.dish_id and b.name like \'%${name}%\' limit 2`));
            } else {
                dishes = await knex("dishes").orderBy("price");
            }
        }

        return response.json(dishes);
    }

    async update(request, response) {
        const { name, category, price, description, ingredients } = request.body;
        const { id } = request.params;
        const user_id = request.user.id;
        const dishFilename = request.file?.filename;

        const diskStorage = new DiskStorage();

        const user = await knex("users").where({ id: user_id }).first();

        if(!user) {
            throw new AppError("Somente usuários autenticados podem criar prato", 401);
        }

        const dish = await knex("dishes").where({ id }).first();

        if(!dish) {
            throw new AppError("Prato não encontrado.");
        }

        if(dish.dish_image && dishFilename) {
            await diskStorage.deleteDishesFile(dish.dish_image);
        }

        if(dishFilename) {
            const filename = await diskStorage.saveDishesFile(dishFilename);
            dish.dish_image = filename;
        }

        dish.name = name ?? dish.name;
        dish.category = category ?? dish.category;
        dish.price = price ?? dish.price;
        dish.description = description ?? dish.description;

        await knex("dishes").where({ id }).update({
            name: dish.name,
            category: dish.category,
            price: dish.price,
            description: dish.description,
            dish_image: dish.dish_image,
            updated_at: knex.fn.now()
        });

        const oldIngredients = await knex("ingredients").where({ dish_id: id });

        if(!ingredients) {
            const ingredientsToDelete = oldIngredients.map(ingredient => {
                                                return ingredient.id
                                            });

            await knex("ingredients").whereIn('id', ingredientsToDelete).delete();
        } else {
            const ingredientsToDelete = oldIngredients.filter(oldIngredient => !ingredients.some(newIngredient => oldIngredient.name === newIngredient))
                                            .map(ingredient => {
                                                return ingredient.id
                                            });

            const ingredientsToInsert = ingredients.filter(newIngredient => !oldIngredients.some(oldIngredient => oldIngredient.name === newIngredient))
                                            .map(ingredient => {
                                                return {
                                                    dish_id: id,
                                                    name: ingredient
                                                }
                                            });
            
            if(ingredientsToDelete.length > 0) {
                await knex("ingredients").whereIn('id', ingredientsToDelete).delete();
            }
            
            if(ingredientsToInsert.length > 0) {
                await knex("ingredients").insert(ingredientsToInsert);
            }
        }

        return response.json();
    }
}

module.exports = DishesController;