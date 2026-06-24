const User = require('../../models/User');
const fs = require("graceful-fs");
const MoneyTransaction= require('../../models/Balance')
exports.editInformation = async(req, res) => {
    const { user_data, email } = req.body;
    // fs.asyncWrite("/myfrontend/public/asset/avatar/"+user_data["_id"]+".png", user_data["avatar"]);
    const result = await User.updateOne({
        email
    }, {
        $set: user_data
    },
        { upsert: false }       
    );
    if(result.n == 0) {
        return res.status(200).json({result: "failed"});
    } else {
        return res.status(200).json({result: "success"});
    }
}

exports.getInformation = async(req, res) => {
    const { email } = req.body;
    const user = await User.findOne({email});
    res.status(200).json({
        data: user
    });
}
exports.chargeMoney=(req, res) =>{
    console.log(req.body)
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
exports.setReviewRate = (req, res) =>{
    console.log(req.user)
    User.updateOne({
        _id: req.user._id
    },
    {
        $set: {
            review: req.body.reviewRate
        }
    }
    
)   
    .then((result) => {
        return res.json(result)
    })
    .catch((err) => {
        console.log(err)
    })
}