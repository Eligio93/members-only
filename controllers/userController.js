const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const passport = require('../passport-config')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
require('dotenv').config()


function checkAdmin(key){
  if(key===process.env.ADMIN_KEY){
    return true
  }
  return false
}
function checkMember(key){
  if(checkAdmin(key) || key=== process.env.MEMBER_KEY){
    return true
  }
  return false
}




/*GET login*/
exports.login_get = function (req, res, next) {
  const logInMessage=req.session.messages
  req.session.messages=[]
  res.render('log-in', { isAuthenticated: req.isAuthenticated(),logInMessage:logInMessage })
}
/*POST login*/
exports.login_post = passport.authenticate("local", {
  successRedirect: '/',
  failureRedirect: '/login',
  failureMessage:true
})

/*GET logout*/
exports.logout = function (req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

/*GET SIGNUP*/
exports.signup_get = function (req, res) {
  res.render("sign-up-form")
}

/*POST Signup*/
exports.signup_post = [
  //insert validation and sanitizing
  body('name','Name must be at least 3 characters')
  .trim()
  .isLength({min:3})
  .notEmpty()
  .escape(),
  body('lastName','Last Name must be at least 3 characters')
  .trim()
  .isLength({min:3})
  .notEmpty()
  .escape(),
  body('email', 'Insert a valid email with the following format info@info.com')
  .trim()
  .isEmail()
  .escape(),
  body('password','Password must be at least 4 characters')
  .trim()
  .isLength({min:3})
  .escape(),
  body('permission-key')
  .trim()
  .escape(),

  asyncHandler(async (req, res, next) => {
    const validationErrors= validationResult(req);
    if(validationErrors.isEmpty()){
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      try {
        const user = new User({
          name: req.body.name,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hashedPassword,
          member: checkMember(req.body["permission-key"]),
          admin: checkAdmin(req.body["permission-key"])
        });
        await user.save();
        res.redirect("/login");
      } catch (err) {
        return next(err);
      };     
    }else{
      console.log(validationErrors)
      res.render('sign-up-form',{validationErrors})
    }
   

  })
]

/*GEt Upgrade*/
exports.upgrade_get= (req,res,next)=>{
  res.render('upgrade')
}

/*POST Upgrade*/
exports.upgrade_post=asyncHandler(async (req,res,next)=>{
  if(req.body['upgrade-key'] === process.env.ADMIN_KEY || req.body['upgrade-key'] === process.env.MEMBER_KEY ){
    await User.findByIdAndUpdate(req.user.id,{admin:checkAdmin(req.body['upgrade-key']), member:checkMember(req.body['upgrade-key'])},{});
    res.redirect('/')
  }else{
    res.render('upgrade',{message:'Insert a valid Key'})
  }  
})
