const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multiparty = require("multiparty");

const User = require("../../models/User");

let JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET_OR_KEY || "secret";

try {
  const CONST = require("../../config/const");
  JWT_SECRET =
    CONST.JWT_SECRET ||
    CONST.SECRET_OR_KEY ||
    CONST.secretOrKey ||
    CONST.SECRET ||
    JWT_SECRET;
} catch (err) {
  // use default/env secret
}

exports.login = async function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        email: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        password: "Password is incorrect",
      });
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
      role: user.role,
      avatar_extension: user.avatar_extension,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      success: true,
      token: "Bearer " + token,
      user: payload,
    });
  } catch (err) {
    console.error("Login error:", err);

    return res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
  }
};

exports.register = function (req, res) {
  const uploadPath = path.join(process.cwd(), "public", "img", "uploads");

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const form = new multiparty.Form({ uploadDir: uploadPath });

  form.parse(req, async function (err, fields, files) {
    try {
      if (err) {
        console.error("Form parse error:", err);
        return res.status(400).json({
          message: "Invalid form data",
          error: err.message,
        });
      }

      const name = fields.name && fields.name[0];
      const email = fields.email && fields.email[0];
      const password = fields.password && fields.password[0];
      const type = fields.type && fields.type[0];
      const birthday = fields.birthday && fields.birthday[0];
      const gender = fields.gender && fields.gender[0];

      if (!name || !email || !password || !type) {
        return res.status(400).json({
          message: "Missing required fields",
        });
      }

      const existingUser = await User.findOne({ email: email });

      if (existingUser) {
        return res.status(400).json({
          email: "Email already exists",
        });
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
        name: name,
        email: email,
        password: password,
        type: type,
        role: 1,
        avatar_extension: avatar_extension,
        birthday: birthday,
        gender: gender,
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