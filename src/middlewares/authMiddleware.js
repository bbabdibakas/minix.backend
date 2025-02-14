const ApiError = require("../exceptions/ApiError");

module.exports = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.Unauthorized());
        }

        next();
    } catch (e) {
        return next(ApiError.Unauthorized());
    }
};