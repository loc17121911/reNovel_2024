import Post from "../models/Post";
import Rating from "../models/Rating";

export const createRating = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { score } = req.body;

    // Kiểm tra xem bài viết có tồn tại không
    const existingRating = await Rating.findOne({
      post: postId,
      user: req.user._id,
    });
    if (existingRating) {
      const error = new Error("Bài viết đã được bạn đánh giá");
      return next(error);
    }

    // Tạo một đối tượng Rating mới
    const newRating = new Rating({
      score,
      user: req.user._id,
      post: postId,
    });

    // Lưu đánh giá vào cơ sở dữ liệu
    await newRating.save();

    // Tính toán trung bình của các đánh giá cho bài viết
    const ratings = await Rating.find({ post: postId });
    const totalScores = ratings.reduce((sum, rating) => sum + rating.score, 0);
    const averageRating = (totalScores / ratings.length).toFixed(1);

    // Cập nhật trường averageRating trong model Post
    await Post.findByIdAndUpdate(postId, { averageRating });

    res.status(201).json({ message: "Đánh giá đã được lưu thành công." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Lỗi khi lưu đánh giá." });
  } 
};

export const getRatingsByPostId = async (req, res) => {
  try {
    const { postId } = req.params;

    // Lấy tất cả các đánh giá cho bài viết có postId
    const ratings = await Rating.find({ post: postId }).populate(
      "user",
      "name"
    );

    res.status(200).json(ratings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Lỗi khi lấy danh sách đánh giá." });
  }
};
