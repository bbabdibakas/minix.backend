const profileService = require('../services/profileService');
const ApiError = require("../exceptions/ApiError");
const database = require("../db");

class ProfileController {
    async getProfileById(req, res, next) {
        try {
            const {id} = req.params;

            if (!id) {
                return next(ApiError.BadRequest('All fields are required'));
            }

            const profileData = await profileService.getProfileById(id);
            return res.status(200).json(profileData);
        } catch (error) {
            next(error);
        }
    }

    async updateProfileById(req, res, next) {
        try {
            const {id} = req.params;
            const updates = req.body;

            if (!id) {
                return next(ApiError.BadRequest('Profile id is required.'));
            }

            if (!Object.keys(updates).length) {
                return next(ApiError.BadRequest('At least one field is required for update.'));
            }
            await database.beginTransaction()

            const profileData = await profileService.updateProfileById(id, updates);
            await database.commitTransaction()

            return res.status(200).json(profileData);
        } catch (error) {
            await database.rollbackTransaction();

            next(error);
        }
    }
}

module.exports = new ProfileController();