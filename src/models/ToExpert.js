const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ToExpertSchema = new Schema({
    telephone : {type : String, require : true},
    email : {type : String, unique : true, require : true},
    subject : {type : String, require : true},
    workYear : {type : String, require : true},
    degree : {type : String, require : true},
    message : {type :String, require : true},
    role: { type: Number, require: true },
    create_at : {type : Date, default : Date.now},
});

module.exports = ToExpert = mongoose.model('to_experts',ToExpertSchema);