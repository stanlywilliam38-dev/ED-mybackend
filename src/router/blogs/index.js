const express = require('express');
const router = express.Router();
const blogsController = require('../../controllers/blogs');
const authMiddlewares = require('../../middlewares/auth')
const requireAuth = authMiddlewares.requireAuth;
router.get('/get-blogs', blogsController.getBlogs);
router.post('/get-comments', blogsController.getBlogComments);
router.post('/post-blog', blogsController.postBlog);
router.post('/post-comment', blogsController.postComment);

module.exports = router;