const Blogs = require('../../models/Blogs');
const User = require('../../models/User');
const multiparty = require('multiparty');
const fs = require('fs');
const { FRONTEND_PROEJCT_NAME } = require('../../config/const');
const uploadDir = require('../../../config/keys').uploadDir;

exports.getBlogs = async function (req, res) {
	const result = await Blogs.find({ parent_email: "" });
	return res.status(200).json(result);
}

exports.getBlogComments = async function (req, res) {
	const { email } = req.body;
	const result = await Blogs.find({ parent_email: email });
	return res.status(200).json(result);
}


exports.postBlog = async function (req, res) {

	const newUploadDir = __dirname + "/.." + uploadDir;
	const form = new multiparty.Form({}, { uploadDir: newUploadDir });
	form.parse(req, (err, fields, files) => {
		if (files) {
			const newBlog = new Blogs({
				email: fields.email[0],
				title: fields.title[0],
				content: fields.content[0],
				image_extension: files.files[0].originalFilename.split(".")[1],
				parent_email: ""
			});
			newBlog.save()
				.then((blog) => {
					files.files.map((file) => {
						const uploadedFile = file;
						newFileName = blog._id;
						const file_extension = file.originalFilename.split(".")[1];
						const newFilePath = `../${FRONTEND_PROEJCT_NAME}/public/assets/img/blogs/${blog._id}.${file_extension}`;
						fs.copyFile(uploadedFile.path, newFilePath, function (err) {
							if (err) {
								return res.json(err);
							}
						})
					})
					res.json({
						result: "success"
					});
				})
				.catch(err => {
					console.log(err);
					res.json({
						result: "fail"
					});
				})
		} else {
			res.json({
				result: "fail"
			})
		}
	})
}

exports.postComment = async function (req, res) {
	const data = req.body.data;
	const { email, comment, parent_email } = data;
	const user = await User.findOne({ email });
	const newBlog = new Blogs({
		email,
		content: comment,
		parent_email,
		title: user.name
	});
	newBlog.save()
		.then((blog) => {
			res.json({
				result: "success"
			});
		})
		.catch(err => {
			console.log(err);
			res.json({
				result: "fail"
			});
		})
}