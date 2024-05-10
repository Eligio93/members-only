var express = require('express');
var router = express.Router();
const User = require('../models/user');
const passport = require('../passport-config');
const userController= require('../controllers/userController')
const messageController= require('../controllers/messageController')

/* GET home page. */
router.get('/', messageController.index);


/*GET Log In*/
router.get('/login',userController.login_get)
/*POST Log In*/
router.post('/login', userController.login_post)

/*GET Logout*/
router.get('/logout',userController.logout)


/*GET SIGN UP*/
router.get('/signup',userController.signup_get )
/*POST SIGN UP*/
router.post("/signup",userController.signup_post);

/*Get Instructions*/
router.get('/instructions',(req,res,next)=>{
    res.render('instructions')
})

/*GET New Message Form*/
router.get('/newMessage',messageController.newMessage_get)
/*POST New Message POst*/
router.post('/newMessage',messageController.newMessage_post)

/*GET delete message*/
router.get('/delete/:messageId',messageController.delete_message_get)
/*POST delete message*/
router.post('/delete/:messageId',messageController.delete_message_post)

module.exports = router;
