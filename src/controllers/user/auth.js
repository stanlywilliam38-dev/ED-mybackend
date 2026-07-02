
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

  const uploadPath = path.join(process.cwd(), "public", "img", "uploads");

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const form = new multiparty.Form({ uploadDir: uploadPath });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        console.error("Form parse error:", err);
        return res.status(400).json({ message: "Invalid form data" });
      }

      const email = fields.email && fields.email[0];
      const name = fields.name && fields.name[0];
      const password = fields.password && fields.password[0];
      const type = fields.type && fields.type[0];
      const birthday = fields.birthday && fields.birthday[0];
      const gender = fields.gender && fields.gender[0];

      if (!email || !name || !password || !type) {
        return res.status(400).json({
          message: "Missing required fields",
        });
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        errors.email = "Email already exists";
        return res.status(400).json(errors);
      }

      const uploadedFile =
        files && files.files && files.files.length > 0
          ? files.files[0]
          : null;

      let avatar_extension = "";

      if (uploadedFile && uploadedFile.originalFilename) {
        avatar_extension = uploadedFile.originalFilename.split(".").pop();
      }

      const newUser = new User({
        name,
        email,
        password,
        type,
        role: 1,
        avatar_extension,
        birthday,
        gender,
      });

      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(newUser.password, salt);

      const savedUser = await newUser.save();

      if (uploadedFile && avatar_extension) {
        const newFilePath = path.join(
          uploadPath,
          `${savedUser._id}.${avatar_extension}`
        );

        fs.copyFileSync(uploadedFile.path, newFilePath);
      }

      return res.json(savedUser);
    } catch (error) {
      console.error("Register error:", error);

      return res.status(500).json({
        message: "Register failed",
        error: error.message,
      });
    }
  });
};

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