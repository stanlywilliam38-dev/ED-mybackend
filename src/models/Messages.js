const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    receiver_email : {type : String},
    sender_email : {type : String},
    message : {type : String},
    receiver_read: {type : Number, default: 0},
    sender_read: {type : Number, default: 0},
    order_id: {type: String},
    create_at : {type : Date, default : Date.now},
});

module.exports = Message = mongoose.model('message', MessageSchema);