const postService = require('../services/postService');
const ApiError = require("../exceptions/ApiError");

class PostController {
    async getPostById(req, res, next) {
        try {
            const {id} = req.params;

            if (!id) {
                return next(ApiError.BadRequest('All fields are required'));
            }

            const postData = await postService.getPostById(id);
            return res.status(200).json(postData);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PostController();