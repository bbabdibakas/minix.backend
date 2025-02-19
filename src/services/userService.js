const ApiError = require("../exceptions/ApiError");
const database = require("../db/index");
const bcrypt = require("bcrypt");
const tokenService = require("../services/tokenService");

class UserService {
    async registration(name, username, password) {
        const getUserByUsername = 'SELECT * FROM users WHERE username = ?';
        const createUser = 'INSERT INTO users (name, username, password) VALUES (?, ?, ?)'
        const getUserById = 'SELECT id, name, username FROM users WHERE id = ?';

        const candidateUser = await database.get(getUserByUsername, [username])
        if (candidateUser) {
            throw ApiError.BadRequest('User with that username already exists')
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const createdUser = await database.runQuery(createUser, [name, username, hashPassword]);
        const user = await database.get(getUserById, [createdUser.lastID]);
        const tokens = tokenService.generateTokens({id: user.id, username: user.username});
        await tokenService.saveToken(user.id, tokens.refreshToken)

        return {...tokens, user}
    }

    async loginByUsername(username, password) {
        const getUserByUsername = 'SELECT * FROM users WHERE username = ?';

        const candidateUser = await database.get(getUserByUsername, [username])
        if (!candidateUser) {
            throw ApiError.NotFound('User with that username not found')
        }

        const isPasswordValid = await bcrypt.compare(password, candidateUser.password);
        if (!isPasswordValid) {
            throw ApiError.BadRequest('Invalid username or password');
        }

        const {password: _, ...user} = candidateUser;
        const tokens = tokenService.generateTokens({id: user.id, username: user.username});
        await tokenService.saveToken(user.id, tokens.refreshToken)

        return {...tokens, user}
    }

}

module.exports = new UserService();