const { Router } = require('express');
const { register, login, test } = require('../controllers/user');
const { isAuth} = require('../middlewares/auth');
const router = Router();

// user routes
router.post('/register', register);
router.post('/login', login);
router.get('/test',isAuth, test)
module.exports = router;