var express = require('express');
var router = express.Router();
const User= require('../models/user');
const passport = require('../passport-config');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/*GET Log In*/
router.get('/login', function (req,res,next){
  res.render('log-in')
})
/*POST LOG In*/
router.post('/login',passport.authenticate('local',{ 
  successRedirect:'/',
  failureRedirect:'/login'

}) )
/*GET SIGN UP*/
router.get('/sign-up',(req, res) => res.render("sign-up-form"))
/*POST SIGN UP*/
router.post("/sign-up", async (req, res, next) => {
  try {
    const user = new User({
      name:req.body.name,
      lastName:req.body.lastName,
      email:req.body.email,
      password:req.body.password,
      member:false,
      admin:false

    });
    await user.save();
    res.redirect("/sign-up");
  } catch(err) {
    return next(err);
  };
});

module.exports = router;
