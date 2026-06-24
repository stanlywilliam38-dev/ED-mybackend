
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const keys = require('../../../config/keys');
const fs = require("fs");
const multiparty = require('multiparty');
const User = require('../../models/User');
const uploadDir = require('../../../config/keys').uploadDir;

const { getUser } = require('../../repository/user.repository');
const { FRONTEND_PROEJCT_NAME } = require('../../config/const');

exports.register = (req, res) => {
    let errors = {};
    const newUploadDir = __dirname + "/.." + uploadDir;
    const form = new multiparty.Form({}, { uploadDir: newUploadDir });

    form.parse(req, (err, fields, files) => {
        console.log("----FILES----", files);
        console.log('----REQ DATA---', fields);

        if (files) {
            User.findOne({ email: fields.email[0] })
                .then((user) => {
                    if (user) {
                        errors.email = 'Email already exists';
                        return res.status(400).json(errors);
                    } else {
                        const newUser = new User({
                            name: fields.name[0],
                            email: fields.email[0],
                            password: fields.password[0],
                            type: fields.type[0],
                            role: 1,
                            avatar_extension: files.files[0].originalFilename.split(".")[1],
                            birthday: fields.birthday[0],
                            gender: fields.gender[0]
                        });
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newUser.password, salt, (err, hash) => {
                                newUser.password = hash;
                                newUser.save()
                                    .then(async (user) => {
                                        files.files.map((file) => {
                                            const uploadedFile = file;
                                            newFileName = user._id;
                                            const file_extension = file.originalFilename.split(".")[1];
                                            const newFilePath =  `../${FRONTEND_PROEJCT_NAME}/public/assets/img/${user._id}.${file_extension}`;
                                            fs.copyFile(uploadedFile.path, newFilePath, function (err) {
                                                if (err) {
                                                    return res.json(err);
                                                }
                                            })
                                        })
                                        res.json(user);
                                    })
                                    .catch(err => console.log(err))
                            });
                        });
                    }
                })
        }
    })
}

exports.login = async (req, res) => {
    let errors = {};
    const { email, password } = req.body;

    const user = await getUser({ email })

    if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
    }
    else {
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (isMatch) {
                    payload =
                        { id: user.id, avatar_extension: user.avatar_extension, name: user.name, role: user.role, type: user.type, gender: user.gender, birthday: user.birthday, email: user.email }
                    jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                        res.json({ success: true, token: 'Bearer ' + token });
                    })
                } else {
                    errors.password = 'Password incorrect';
                    return res.status(400).json(errors);
                }
            })
    }
}