import Comment from "../models/Comment";
import Post from "../models/Post";

export const createComment = async (req, res, next) => {
  try {
    const { desc, slug, parent, replyOnUser } = req.body;

    const post = await Post.findOne({ slug: slug });

    if (!post) {
      const error = new Error("Khong tim thay bai dang");
      return next(error);
    }
    const newComment = new Comment({
      user: req.user._id,
      desc,
      post: post._id,
      parent,
      replyOnUser,
    });

    const saveComment = await newComment.save();
    return res.json(saveComment);
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const { desc } = req.body;

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      const error = new Error("Khong tim thay Comment");
      return next(error);
    }
    comment.desc = desc || comment.desc;
    const update = await comment.save();
    return res.json(update);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    await Comment.deleteMany({ parent: comment._id });

    if (!comment) {
      const error = new Error("Khong tim thay Comment");
      return next(error);
    }

    return res.json({
      message: "Comment đã được xóa",
    });
  } catch (error) {
    next(error);
  }
};
export const getAllComments = async (req, res) => {
  try {
    const { search } = req.query;

    let query = Comment.find().populate("user post replies");

    if (search) {
      query = query.where("desc", new RegExp(search, "i"));
    }

    const comments = await query.exec();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy các comment" });
  }
};

export const checkMultiComments = async (req, res) => {
  const { commentIds } = req.body;

  try {
    const comments = await Comment.find({ _id: { $in: commentIds } });

    for (const comment of comments) {
      comment.check = !comment.check;
      await comment.save();
    }

    res.status(200).json({ message: "Comments updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update comments." });
  }
};
