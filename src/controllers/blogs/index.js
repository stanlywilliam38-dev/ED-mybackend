const Blogs = require('../../models/Blogs');
const User = require('../../models/User');
const fs = require('fs');
const { FRONTEND_PROEJCT_NAME } = require('../../config/const');

const ALLOWED_BLOG_IMAGE_MIME_TO_EXT = { jpeg: "jpg", jpg: "jpg", png: "png", gif: "gif", webp: "webp" };

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

	const { email, title, content, image } = req.body;

	let image_extension;
	let imageBuffer;

	if (typeof image === "string") {
		const match = image.match(/^data:image\/(\w+);base64,(.+)$/);
		const extension = match && ALLOWED_BLOG_IMAGE_MIME_TO_EXT[match[1].toLowerCase()];

		if (match && extension) {
			image_extension = extension;
			imageBuffer = Buffer.from(match[2], "base64");
		}
	}

	const newBlog = new Blogs({
		email,
		title,
		content,
		image_extension,
		parent_email: ""
	});

	newBlog.save()
		.then((blog) => {
			if (imageBuffer) {
				const uploadDir = __dirname + `/../../../../${FRONTEND_PROEJCT_NAME}/public/assets/img/blogs`;
				if (!fs.existsSync(uploadDir)) {
					fs.mkdirSync(uploadDir, { recursive: true });
				}
				fs.writeFileSync(`${uploadDir}/${blog._id}.${image_extension}`, imageBuffer);
			}
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