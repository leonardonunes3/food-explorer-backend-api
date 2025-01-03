const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");

const knex = require("../database/knex");

class UsersController {

    async create(request, response) {

        const {name, email, password} = request.body;

        const checkUserExists = await knex("users").where({ email }).first();

        if(checkUserExists) {
            throw new AppError("Este e-mail já está em uso.");
        }

        const hashedPassword = await hash(password, 8);

        await knex("users").insert({
            name,
            email,
            password: hashedPassword
        });

        response.status(201).json();
    }

    async update(request, response) {
        const { name, email, password, newPassword } = request.body;
        const user_id = request.user.id;

        const user = await knex('users').where({ id: user_id }).first();

        if(!user) {
            throw new AppError("Usuário não encontrado.");
        }

        if(email) {
            const userWithUpdatedEmail = await knex("users").where({ email }).first();

            if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
                throw new AppError("Este e-mail já está sendo utilizado");
            }
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if(newPassword && !password) {
            throw new AppError("Favor informar a senha antiga para definir a nova senha.");
        }

        if(newPassword && password) {
            const checkOldPassword = await compare(password, user.password);

            if(!checkOldPassword) {
                throw new AppError("A senha antiga não confere.")
            }

            user.password = await hash(newPassword, 8);
        }

        await knex("users").where({ id: user_id }).update({
            name: user.name,
            email: user.email,
            password: user.password,
            updated_at: knex.fn.now()
        });

        return response.json();
    }

    async index(request, response) {
        const { user } = request;

        const validateUserExists = await knex("users").where({ id: user.id });

        if(validateUserExists.length === 0) {
            throw new AppError("Unauthorized", 401);
        }

        return response.status(200).json();
    }
}

module.exports = UsersController;