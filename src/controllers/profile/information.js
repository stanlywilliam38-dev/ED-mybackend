const User = require('../../models/User');
const fs = require("graceful-fs");
const path = require("path");
const MoneyTransaction= require('../../models/Balance')

const uploadPath = path.join(process.cwd(), "public", "img", "uploads");
const ALLOWED_AVATAR_MIME_TO_EXT = { jpeg: "jpg", jpg: "jpg", png: "png", gif: "gif", webp: "webp" };
const EDITABLE_FIELDS = ["name", "gender", "birthday"];

exports.editInformation = async(req, res) => {
    const { user_data = {}, email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(200).json({ result: "failed" });
    }

    const update = {};
    EDITABLE_FIELDS.forEach((field) => {
        if (user_data[field] !== undefined) update[field] = user_data[field];
    });

    if (typeof user_data.avatar === "string") {
        const match = user_data.avatar.match(/^data:image\/(\w+);base64,(.+)$/);
        const extension = match && ALLOWED_AVATAR_MIME_TO_EXT[match[1].toLowerCase()];

        if (match && extension) {
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            fs.writeFileSync(
                path.join(uploadPath, `${user._id}.${extension}`),
                Buffer.from(match[2], "base64")
            );
            update.avatar_extension = extension;
        }
    }

    const result = await User.updateOne({
        email
    }, {
        $set: update
    },
        { upsert: false }
    );
    if(result.matchedCount === 0) {
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