const path = require('path');
const fs = require('fs');
const Blogs = require('../../models/Blogs');
const User = require('../../models/User');

const ALLOWED_BLOG_IMAGE_MIME_TO_EXT = {
    jpeg: 'jpg',
    jpg: 'jpg',
    png: 'png',
    gif: 'gif',
    webp: 'webp'
};

function getBaseUrl(req) {
    return process.env.BACKEND_PUBLIC_URL || `${req.protocol}://${req.get('host')}`;
}

function addImageUrl(req, blog) {
    const item = blog.toObject ? blog.toObject() : blog;

    return {
        ...item,
        image_url: item.image_extension
            ? `${getBaseUrl(req)}/assets/img/blogs/${item._id}.${item.image_extension}`
            : ''
    };
}

function parseBase64Image(image) {
    if (typeof image !== 'string') {
        return {
            image_extension: undefined,
            imageBuffer: undefined
        };
    }

    const match = image.match(/^data:image\/(\w+);base64,(.+)$/);

    if (!match) {
        return {
            image_extension: undefined,
            imageBuffer: undefined
        };
    }

    const mimeExt = match[1].toLowerCase();
    const image_extension = ALLOWED_BLOG_IMAGE_MIME_TO_EXT[mimeExt];

    if (!image_extension) {
        return {
            image_extension: undefined,
            imageBuffer: undefined
        };
    }

    return {
        image_extension,
        imageBuffer: Buffer.from(match[2], 'base64')
    };
}

exports.getBlogs = async function (req, res) {
    try {
        const result = await Blogs.find({ parent_email: '' }).lean();
        return res.status(200).json(result.map((blog) => addImageUrl(req, blog)));
    } catch (err) {
        console.log(err);
        return res.status(500).json([]);
    }
};

exports.getBlogComments = async function (req, res) {
    try {
        const { email } = req.body;
        const result = await Blogs.find({ parent_email: email }).lean();
        return res.status(200).json(result.map((blog) => addImageUrl(req, blog)));
    } catch (err) {
        console.log(err);
        return res.status(500).json([]);
    }
};

exports.postBlog = async function (req, res) {
    try {
        const { email, title, content, image } = req.body;
        const { image_extension, imageBuffer } = parseBase64Image(image);

        const blog = await Blogs.create({
            email,
            title,
            content,
            image_extension,
            parent_email: ''
        });

        if (imageBuffer) {
            // Save image inside the backend project, not inside the frontend project.
            // Make sure server.js serves this folder: app.use('/assets', express.static(path.join(__dirname, 'public/assets')))
            const uploadDir = path.join(__dirname, '..', '..', '..', 'public', 'assets', 'img', 'blogs');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            fs.writeFileSync(path.join(uploadDir, `${blog._id}.${image_extension}`), imageBuffer);
        }

        return res.json({
            result: 'success',
            blog: addImageUrl(req, blog)
        });
    } catch (err) {
        console.log(err);
        return res.json({
            result: 'fail'
        });
    }
};

exports.postComment = async function (req, res) {
    try {
        const data = req.body.data;
        const { email, comment, parent_email } = data;
        const user = await User.findOne({ email });

        await Blogs.create({
            email,
            content: comment,
            parent_email,
            title: user?.name || email
        });

        return res.json({
            result: 'success'
        });
    } catch (err) {
        console.log(err);
        return res.json({
            result: 'fail'
        });
    }
};
