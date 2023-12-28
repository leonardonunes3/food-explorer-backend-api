
exports.up = knex => knex.schema.createTable("dishes", table => {
    table.increments("id");
    table.text("name");
    table.enu("category", ["Refeições", "Sobremesas", "Bebidas", "Pratos Principais"]);
    table.float("price");
    table.text("description");
    table.text("dish_image");
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("dishes");
