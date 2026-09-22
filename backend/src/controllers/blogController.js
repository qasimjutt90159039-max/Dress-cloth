import BlogPost from '../models/BlogPost.js';

export const getBlogPosts = async (req, res, next) => {
  try {
    const posts = await BlogPost.find({ isPublished: true }).sort('-publishedAt');
    res.status(200).json({ success: true, count: posts.length, posts });
  } catch (error) {
    next(error);
  }
};

export const getBlogPostBySlug = async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, isPublished: true });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    res.status(200).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

export const getAllAdminBlogs = async (req, res, next) => {
  try {
    const posts = await BlogPost.find().sort('-createdAt');
    res.status(200).json({ success: true, count: posts.length, posts });
  } catch (error) {
    next(error);
  }
};

export const createBlogPost = async (req, res, next) => {
  try {
    const slug = req.body.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    const post = await BlogPost.create({
      ...req.body,
      slug: req.body.slug || slug
    });

    res.status(201).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

export const updateBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    res.status(200).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

export const deleteBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    await post.deleteOne();
    res.status(200).json({ success: true, message: 'Article deleted' });
  } catch (error) {
    next(error);
  }
};
