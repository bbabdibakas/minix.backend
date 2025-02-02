const ApiError = require("../exceptions/ApiError");
const database = require("../db/index");
const bcrypt = require("bcrypt");
const uuid = require("uuid");

class UserService {
    async registration(name, email, username, password) {
        const getUserByEmail = 'SELECT * FROM users WHERE email = ?';
        const getUserByUsername = 'SELECT * FROM users WHERE username = ?';
        const createUser = 'INSERT INTO users (name, email, username, password,activationLink) VALUES (?, ?, ?, ?, ?)'
        const getUserById = 'SELECT id, name, email, username, isActivated, activationLink FROM users WHERE id = ?';

        const candidateByEmail = await database.get(getUserByEmail, [email])
        if (candidateByEmail) {
            throw ApiError.BadRequest('User with that email already exists')
        }

        const candidateUsername = await database.get(getUserByUsername, [username])
        if (candidateUsername) {
            throw ApiError.BadRequest('User with that username already exists')
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();

        const result = await database.runQuery(createUser, [name, email, username, hashPassword, activationLink]);
        const userData = await database.get(getUserById, [result.lastID]);
        userData.isActivated = userData.isActivated === 1

        return userData
    }

    async loginByUsername(username, password) {
        const getUserByUsername = 'SELECT * FROM users WHERE username = ?';

        const candidate = await database.get(getUserByUsername, [username])
        if (!candidate) {
            throw ApiError.NotFound('User with that username not found')
        }

        const isPasswordValid = await bcrypt.compare(password, candidate.password);
        if (!isPasswordValid) {
            throw ApiError.Unauthorized('Invalid username or password');
        }

        candidate.isActivated = candidate.isActivated === 1;
        const {password: _, ...candidateWithoutPassword} = candidate;

        return candidateWithoutPassword
    }
}

module.exports = new UserService();