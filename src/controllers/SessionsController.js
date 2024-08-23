const AppError = require("../utils/AppError");
const { compare } = require("bcryptjs");
const authConfig = require("../configs/auth");
const { sign } = require("jsonwebtoken");

const knex = require("../database/knex");

class SessionsController {

    async create(request, response) {

        const { email, password } = request.body;

        const user = await knex("users").where({ email }).first();

        if(!user) {
            throw new AppError("E-mail e/ou senha incorreta.", 401);
        }

        const checkPassword = await compare(password, user.password);

        if(!checkPassword) {
            throw new AppError("E-mail e/ou senha incorreta.", 401);
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({ role: user.role }, secret, {
            subject: String(user.id),
            expiresIn
        });

        response.cookie("token", token, {
            httpOnly: true,
            sameSite: "none",
            // Secure is not working in Safari localhost
            // Set secure true when deploying
            //secure: true,
            maxAge: 15 * 60 * 1000
        });

        delete user.password

        return response.json({ user });
    }
}

module.exports = SessionsController;