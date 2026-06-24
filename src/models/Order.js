const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    budget: { type: Number, require: true },    
    message : {type: String, require : true},
    status: {type: Number, require : true, default: 0}, //0: blocked, 1: accepted, 2: completed
    create_at : {type : Date, default : Date.now},
});

module.exports = Orders = mongoose.model('orders',OrderSchema);