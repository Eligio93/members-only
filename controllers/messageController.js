const { format } = require('date-fns')
const Message = require('../models/message')
const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')

/*GET HOMEPAGE With messages*/
exports.index = asyncHandler(async (req, res, next) => {
    const allMessages = await Message.find({}).populate('author')
    res.render('index', { messages: allMessages, user: req.user })
})

/*Get New Message form*/
exports.newMessage_get = function (req, res, next) {
    res.render('message-form', { user: req.user })
}
/*POST New Message form*/
exports.newMessage_post = [
    // sanitize and validate data
    body('messageTitle', 'Title must be at least 3 characters')
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body('message', 'Message must be at least 3 characters')
        .trim()
        .isLength({ min: 3 })
        .escape(),
    asyncHandler(async (req, res, next) => {
        const validationErrors = validationResult(req)
        if (validationErrors.isEmpty()) {
            const author = await User.findById(req.user.id)
            //use date fns to format date
            const date = format(new Date(), 'dd-MMMM-yyyy')
            const message = new Message({
                title: req.body.messageTitle,
                text: req.body.message,
                author: author,
                date: date
            })
            //creates message in DB
            await message.save()
            res.redirect('/')
        } else {
            res.render('message-form', { validationErrors })
        }

    })

]

/*GET DELETE MESSAGE*/
exports.delete_message_get = asyncHandler(async (req, res, next) => {
    const message = await Message.findById(req.params.messageId).populate('author')
    res.render('delete-message', { message: message, user: req.user })
})

/*POST DELETE MESSAGE*/
exports.delete_message_post = asyncHandler(async (req, res, next) => {
    let message = await Message.findById(req.params.messageId);
    await Message.findByIdAndDelete(message._id)
    res.redirect('/')
})