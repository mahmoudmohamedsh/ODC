const mongoose = require('mongoose')
const schema = mongoose.Schema;

const UserSchema = new schema({
    email:{type:String,require:true},
    imageUrl:{type:String,},
    password:{type:String,required:true,select: false},
    name:{type:String,required:true},
    courses:[{type:mongoose.Schema.Types.ObjectId,ref:'courses'}],
    skills:[{type:String}],
    isAdmin:{type:Boolean,default:false}
},{timestamps:true});

module.exports = mongoose.model('user',UserSchema);