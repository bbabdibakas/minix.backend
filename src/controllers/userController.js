const userService = require('../services/userService');
const profileService = require('../services/profileService');
const ApiError = require('../exceptions/ApiError')

class UserController {
    async registration(req, res, next) {
        try {
            const {name, username, password} = req.body
            if (!name || !username || !password) {
                return next(ApiError.BadRequest('All fields are required'));
            }

            const userData = await userService.registration(name, username, password)
            await profileService.createProfile(name, username, userData.user.id)
            return res.status(200).json(userData)
        } catch (error) {
            next(error)
        }
    }

    async loginByUsername(req, res, next) {
        try {
            const {username, password} = req.body
            if (!username || !password) {
                return next(ApiError.BadRequest('All fields are required'));
            }

            const userData = await userService.loginByUsername(username, password)
            return res.status(200).json(userData)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new UserController();