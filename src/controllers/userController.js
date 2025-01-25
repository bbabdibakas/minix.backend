const database = require("../db");

class UserController {
    async registration(req, res, next) {
        try {
            const {name, email, username, password} = req.body

            if (!name || !email || !username || !password) {
                return res.status(400).json({
                    message: 'All fields are required'
                })
            }

            const createUser = 'INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)'

            try {
                await database.runQuery(createUser, [name, email, username, password]);
                console.log('Table "users" checked/created successfully.');
                res.status(200).json({
                    message: 'Successfully registered',
                })
            } catch (error) {
                console.error('Error creating the user:', error);
                res.status(500).json({
                    message: 'Internal server error',
                });
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: 'Internal server error',
            });
        }
    }
}

module.exports = new UserController();