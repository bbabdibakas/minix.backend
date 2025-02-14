const Router = require('express').Router;
const userController = require('../controllers/userController');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = new Router();

router.post('/registration', userController.registration);
router.post('/loginByUsername', userController.loginByUsername);
router.get('/profiles/:id', authMiddleware, profileController.getProfileById);

module.exports = router