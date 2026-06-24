const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdviceSchema = new Schema({
    receiver_email : {type : String},
    sender_email : {type : String},
    message : {type : String},
    receiver_read: {type : Number, default: 0},
    sender_read: {type : Number, default: 0},
    create_at : {type : Date, default : Date.now},
});

module.exports = Advice = mongoose.model('advice', AdviceSchema);