
const User = require('../../models/User');
const { getUser } = require('../../repository/user.repository');
const ToExpert = require('../../models/ToExpert')

exports.getExpert = async (req, res) => {
    res.json(req.user)
    // const user = await getUser({firstName,lastName,})
    
}
exports.toExpertUser = async(req, res) => {
    let errors = {};
    const {telephone ,email, subject , workYear , degree , message, role} = req.body;
    
    // const user = await getUser({email})
    const newTo_expert = new ToExpert({
        telephone: telephone,    
        email: email,
        subject: subject,
        workYear:workYear,
        message: message,
        degree:degree,
        role: 2
    });
    
    newTo_expert.save()
    .then((result) => {
        console.log(result)
        return res.json(result)
    })
    .catch((err) => {
        console.log(err)
        return res.status(500).json(err)
    })
    if(!User){
        errors.email = 'User not found';
        return res.status(404).json(errors);
    }
}
