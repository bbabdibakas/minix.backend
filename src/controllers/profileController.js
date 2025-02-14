const profileService = require('../services/profileService');
const ApiError = require("../exceptions/ApiError");

class ProfileController {
    async getProfileById(req, res, next) {
        try {
            const { id } = req.params;

            if (!id) {
                return next(ApiError.BadRequest('All fields are required'));
            }

            const profileData = await profileService.getProfileById(id);
            return res.status(200).json(profileData);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProfileController();