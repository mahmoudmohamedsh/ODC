const mongoose = require('mongoose')
const schema = mongoose.Schema;
const courseSchema = new schema({
    title:{type:String,require:true},
    imageUrl:{type:String,required:true},
    content:{type:String,required:true},
    instructor:{type:String,required:true},
    skills:[{type:String,required:true}],
    prerequisite:[{type:String}]
},{timestamps:true});

module.exports = mongoose.model('courses',courseSchema);