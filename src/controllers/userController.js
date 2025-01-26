const database = require("../db");
const bcrypt = require("bcrypt");
const uuid = require("uuid");

class UserController {
    async registration(req, res, next) {
        const checkUserByEmail = 'SELECT * FROM users WHERE email = ?';
        const checkUserByUsername = 'SELECT * FROM users WHERE username = ?';
        const createUser = 'INSERT INTO users (name, email, username, password,activationLink) VALUES (?, ?, ?, ?, ?)'
        const getUserById = 'SELECT id, name, email, username, isActivated, activationLink FROM users WHERE id = ?';

        try {
            const {name, email, username, password} = req.body

            if (!name || !email || !username || !password) {
                return res.status(400).json({
                    message: 'All fields are required'
                })
            }

            const candidateByEmail = await database.get(checkUserByEmail, [email])
            if (candidateByEmail) {
                return res.status(400).json({
                    message: 'User with that email already exists'
                });
            }

            const candidateUsername = await database.get(checkUserByUsername, [username])
            if (candidateUsername) {
                return res.status(400).json({
                    message: 'User with that username already exists'
                });
            }

            const hashPassword = await bcrypt.hash(password, 3);
            const activationLink = uuid.v4();
            const result = await database.runQuery(createUser, [name, email, username, hashPassword, activationLink]);

            const user = await database.get(getUserById, [result.lastID]);
            res.status(200).json({
                user,
            })
        } catch (error) {
            console.error('Error creating the User:', error);
            res.status(500).json({
                message: 'Internal server error',
            });
        }
    }
}

module.exports = new UserController();