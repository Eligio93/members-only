const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema= new Schema({
    name:{type:String, required:true, minLength: 1},
    lastName:{type:String, required:true, minLength:1},
    email:{type:String, required:true, minLength:5},
    password:{type:String, required:true, minLength:5},
    member:{type:Boolean, required:true},
    admin:{type:Boolean,required:true}
})

module.exports=mongoose.model('User',UserSchema)