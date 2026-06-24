const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MoneyTransactionSchema = new Schema({
    user : {
        type : Schema.Types.ObjectID, 
        require: true, 
        ref: 'users'
    },
    quantity: {
        type: Number,
        validate: {
            validator: function (b) {
                return b >= 0
            },
            message: 'No Money'
        },
        default: 3000,
    },
    create_at : {type : Date, default : Date.now},
});

module.exports = MoneyTransaction = mongoose.model('money_transactions',MoneyTransactionSchema);