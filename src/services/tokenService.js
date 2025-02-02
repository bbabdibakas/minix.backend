const jwt = require('jsonwebtoken');
const database = require("../db");

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '60s'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30m'})
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const getTokenByUserId = 'SELECT * FROM tokens WHERE userId  = ?';
        const updateToken = 'UPDATE tokens SET refreshToken = ? WHERE userId = ?';
        const createToken = 'INSERT INTO tokens (userId, refreshToken) VALUES (?, ?)'

        const candidateToken = await database.get(getTokenByUserId, [userId])
        if (candidateToken) {
            candidateToken.refreshToken = refreshToken
            await database.runQuery(updateToken, [refreshToken, userId]);
            return candidateToken
        }

        const createdToken = await database.runQuery(createToken, [userId, refreshToken]);
        return await database.get(getTokenByUserId, [createdToken.lastID])
    }
}

module.exports = new TokenService();