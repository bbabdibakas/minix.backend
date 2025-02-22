const database = require("../db");
const ApiError = require("../exceptions/ApiError");

class PostService {
    async getPostById(id) {
        const getPostById = 'SELECT * FROM posts WHERE id = ?';

        const candidatePost = await database.get(getPostById, [id])
        if (!candidatePost) {
            throw ApiError.NotFound('Post with that id not found')
        }

        return candidatePost;
    }
}

module.exports = new PostService();