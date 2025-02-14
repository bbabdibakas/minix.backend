const database = require("../db/index");
const ApiError = require("../exceptions/ApiError");

class ProfileService {
    async createProfile(name, username, userId) {
        const getProfileByUsername = 'SELECT * FROM profiles WHERE username = ?';
        const createProfile = 'INSERT INTO profiles (name, username, userId) VALUES (?, ?, ?)'

        const candidateProfile = await database.get(getProfileByUsername, [username])
        if (candidateProfile) {
            throw ApiError.BadRequest('Profile with that username already exists')
        }

        return await database.runQuery(createProfile, [name, username, userId]);
    }

    async getProfileById(id) {
        const getProfileById = 'SELECT * FROM profiles WHERE id = ?';

        const candidateProfile = await database.get(getProfileById, [id])
        if (!candidateProfile) {
            throw ApiError.NotFound('Profile with that id not found')
        }

        return candidateProfile;
    }
}

module.exports = new ProfileService();