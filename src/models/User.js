const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name : {type : String, require : true},
    email : {type : String, unique : true, require : true},
    password : {type : String, require : true},
    confirmPassword : {type : String, require : true},
    type : {type: String, require : true},
    role: { type: Number, require : true },
    avatar_extension: { type: String, require : true},
    gender: { type: String, require : true},
    blog_id: { type: String, require : true},
    birthday : {type : Date, default : Date.now},
    review: {type:Number, default: -1},

    balance: {
        type: Number,
        validate: {
            validator: function (b) {
                return b >= 0
            },
            message: 'No balance'
        },
        default: 3000,
    },
    create_at : {type : Date, default : Date.now},
});

module.exports = User = mongoose.model('users',UserSchema);