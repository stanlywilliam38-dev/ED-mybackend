const User = require('../../models/User');
exports.getUsers = async(req, res) => {
    const {role} = req.body;
    let users = [];
    if(role == "all") {
        users = await User.find();
    } else {
        users = await User.find({role})
    }
    return res.status(200).json(users);
}

exports.changeType = async(req, res) => {
    const { email, blog_id } = req.body;
    const user = await User.findOne({email});
    
    let update_type = "student";
    if(user.type == "student") {
        update_type = "expert";
    }

    const data = await User.updateOne(
        {email},
        {
            $set: {
                type: update_type,
                blog_id: user.type == "student" ? blog_id: "" 
            }
        }
    )
    if(data.n == 0) {
        res.status(200).json({
            result: "failed"
        })
    } else {
        res.status(200).json({
            result: "success"
        })
    }
}
exports.blockUser = async(req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    let result = {};
    if(user.role == "2") { // if block
        result = await User.updateOne( { email }, { $set: { role: 1 } } );
    } else {
        result = await User.updateOne( { email }, { $set: { role: 2 } } );
    }
    if(result.n == 0) {

    } else {

    }
}