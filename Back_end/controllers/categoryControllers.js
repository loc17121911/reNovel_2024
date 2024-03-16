import Post from "../models/Post";
import PostCategory from "../models/PostCategory";

export const createPostCategory = async (req, res, next) => {
  try {
    const { title } = req.body;

    const postCategory = await PostCategory.findOne({ title });

    if (postCategory) {
      const error = new Error("Category da duoc tao");
      return next(error);
    }

    const newPostCategory = new PostCategory({
      title,
    });

    const savedPostCategory = await newPostCategory.save();

    return res.status(201).json(savedPostCategory);
  } catch (error) {
    next(error);
  }
};

export const getAllPostCategory = async (req, res, next) => {
  try {
    const postCategory = await PostCategory.find({});
    return res.json(postCategory);
  } catch (error) {
    next(error);
  }
};
export const getDetailCategory = async (req, res, next) => {
  try {
    const postCategory = await PostCategory.findOne({ _id: req.params._id });
    return res.json(postCategory);
  } catch (error) {
    next(error);
  }
};

export const updatePostCategory = async (req, res, next) => {
  try {
    const { title } = req.body;

    const postCategory = await PostCategory.findByIdAndUpdate(
      req.params.postCategoryId,
      {
        title,
      },
      {
        new: true,
      }
    );

    if (!postCategory) {
      const error = new Error("Không tìm thấy danh mục");
      return next(error);
    }

    return res.json(postCategory);
  } catch (error) {
    next(error);
  }
};

export const deletePostCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.postCategoryId;

    await Post.updateMany(
      { category: { $in: [categoryId] } },
      { $pull: { category: categoryId } }
    );

    await PostCategory.deleteOne({ _id: categoryId });

    res.send({
      message: "Danh Muc nay Da Duoc Xoa!",
    });
  } catch (error) {
    next(error);
  }
};
