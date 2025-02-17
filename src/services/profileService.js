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

    async updateProfileById(id, updates) {
        delete updates.id;

        const getProfileById = 'SELECT * FROM profiles WHERE id = ?';
        const candidate = await database.get(getProfileById, [id]);

        if (!candidate) {
            throw ApiError.NotFound('Profile with that id not found')
        }

        if (updates.username) {
            const usernameRegex = /^[a-zA-Z0-9_]+$/;
            if (!usernameRegex.test(updates.username)) {
                throw ApiError.BadRequest('Username contains invalid characters. Only letters, numbers, and underscores are allowed.');
            }

            if (updates.username !== candidate.username) {
                const getProfileByUsername = 'SELECT 1 FROM profiles WHERE username = ?';
                const candidateByUsername = await database.get(getProfileByUsername, [updates.username]);

                if (candidateByUsername) {
                    throw ApiError.BadRequest(`Username is already taken.`);
                }
            }
        }

        const fields = Object.keys(updates);
        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = [...fields.map(field => updates[field]), id];

        const updateProfileById = `UPDATE profiles
                                   SET ${setClause}
                                   WHERE id = ? RETURNING *`;

        await database.runQuery(updateProfileById, values);
        return await database.get(getProfileById, [id])
    }
}

module.exports = new ProfileService();