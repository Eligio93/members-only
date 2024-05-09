const Message = require('../models/message')
const User= require('../models/user')
const asyncHandler=require('express-async-handler')

exports.index=asyncHandler(async(req,res,next)=>{
    const allMessages= await Message.find({}).populate('author')
    console.log(req.user)
    res.render('index',{messages:allMessages, user:req.user})
})

/*Get New Message form*/
exports.newMessage_get=function(req,res,next){
    res.render('message-form',{user:req.user})
}
/*POST New Message form*/
exports.newMessage_post=asyncHandler(async (req,res,next)=>{
    const author= await User.findById(req.user.id)
    const message= new Message({
        title:req.body.messageTitle,
        text: req.body.message,
        author: author,
        date: new Date()
    })
    await message.save()
    res.redirect('/')
})

/*GET DELETE MESSAGE*/
exports.delete_message_get= asyncHandler(async (req,res,next)=>{
    const message= await Message.findById(req.params.messageId).populate('author')
    res.render('delete-message',{message:message,user:req.user})
})

/*POST DELETE MESSAGE*/
exports.delete_message_post= asyncHandler(async (req,res,next)=>{
    let message= await Message.findById(req.params.messageId);
    await Message.findByIdAndDelete(message._id)
    res.redirect('/')
})