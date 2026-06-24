const User = require( "../models/User" );

module.exports = {
    getUser: async ({ email }) => {
        console.log(email)
        return await User.findOne({email})
}}
