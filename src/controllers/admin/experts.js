const ToExpert = require('../../models/ToExpert');
exports.getExperts = async (req, res) => {
    // const {email, name, gender} = req.body;
    const { email, state } = req.body.data;
    let result = [];
    if (state == "all") {
        result = await ToExpert.find({});
    } else {
        result = await ToExpert.find({ role: state });
    }
    return res.status(200).json(result);
}

exports.allowExpert = async (req, res) => {
    const { email } = req.body;
    const user = await ToExpert.findOne({ email });
    let result = {};

    if (user.role == "2") { // if block
        result = await ToExpert.updateOne({ email }, { $set: { role: 1 } });
    } else {
        result = await ToExpert.updateOne({ email }, { $set: { role: 2 } });
    }
    if (result.n == 0) {
        return res.status(200).json({
            result: "failed"
        })
    } else {
        return res.status(200).json({
            result: "success"
        })
    }
}

exports.blockUser = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    let result = {};
    if (user.role == "2") { // if block
        result = await User.updateOne({ email }, { $set: { role: 1 } });
    } else {
        result = await User.updateOne({ email }, { $set: { role: 2 } });
    }
    if (result.n == 0) {

    } else {

    }
}
