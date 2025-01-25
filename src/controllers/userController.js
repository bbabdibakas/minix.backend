class UserController {
    async registration(req, res, next) {
        const {name, email, username, password} = req.body

        if (!name || !email || !username || !password) {
            return res.status(400).json({
                message: 'All fields are required'
            })
        }

        try {
            res.status(200).json({
                message: 'Successfully registered',
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: 'Internal server error',
            });
        }
    }
}

module.exports = new UserController();