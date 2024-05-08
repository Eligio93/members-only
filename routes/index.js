var express = require('express');
var router = express.Router();
const User = require('../models/user');
const passport = require('../passport-config');
const userController= require('../controllers/userController')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express', user: req.user });
});


/*GET Log In*/
router.get('/login',userController.login_get)
/*POST Log In*/
router.post('/login', userController.login_post)

/*GET Logout*/
router.get('/logout',userController.logout)



/*GET SIGN UP*/
router.get('/sign-up',userController.signup_get )
/*POST SIGN UP*/
router.post("/sign-up",userController.signup_post);

module.exports = router;
