
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const keys = require('../../../config/keys');

const User = require('../../models/User')
const MoneyTransaction= require('../../models/Balance')
const { getUser } = require('../../repository/user.repository')

exports.getProfile = async (req, res) => {
    console.log(req.user)
    res.json(req.user)
    // const user = await getUser({firstName,lastName,})
    
}
exports.editProfile = (req, res) => {
    console.log(req.body)
    User.updateOne({
        _id: req.user._id
    },{
        first_name:req.body.firstName,
        last_name: req.body.lastName,
        
    })
     
    .then((result) => {
        if(result.nModified){
            res.json({
                success: true
            })
        }
        else{
            res.json({
                success:false
            })
        }
    })
    .catch((err) => {
        console.log(err)
        return res.status(400).json(err);
    })
}
exports.chargeMoney=(req, res) =>{
    User.updateOne({
        _id: req.user._id
    },
    {
        $inc: {
            balance: req.body.balance
        }
    }
    )
    .then((result) => {
        if(result.nModified){
            res.json({
                success: true
            })
            const newMoneyTransaction = new MoneyTransaction({
                user:req.user._id,
                quantity:req.body.balance
            });
            newMoneyTransaction.save()
            .then((moneyTransaction) => {
                console.log(moneyTransaction)
            })
            .catch((err)=> {
                console.log(err)
            })

        }
        else{
            res.json({
                success:false
            })
        }
    })
    .catch((err) => {
        console.log(err)
        return res.status(400).json(err);
    })
}