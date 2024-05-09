const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema= new Schema({
    title:{type:String, required:true, minLength: 1},
    text:{type:String, required:true, minLength:1},
    author:{type:Schema.Types.ObjectId, ref:'User', required:true},
    date:{type:Date, required:true}
})

MessageSchema.virtual('url').get(function(){
    return this._id
})


module.exports=mongoose.model('Message',MessageSchema)