const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogsSchema = new Schema({
    email: {type : String},
    parent_email: {type : String},
    title : {type : String},
    image_extension: {type: String},
    content : {type : String},
    create_at : {type : Date, default : Date.now},
});

module.exports = Blogs = mongoose.model('blogs', BlogsSchema);