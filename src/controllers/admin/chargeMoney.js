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