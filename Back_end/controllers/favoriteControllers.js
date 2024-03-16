import Favorite from "../models/Favorite";
import Post from "../models/Post";

// Tạo yêu thích
const createFavorite = async (req, res) => {
  try {
    const { postId } = req.params;

    // Kiểm tra xem yêu thích đã tồn tại hay chưa
    const existingFavorite = await Favorite.findOne({
      user: req.user._id,
    });

    if (existingFavorite) {
      // Kiểm tra xem bài viết đã tồn tại trong mảng favorites hay chưa
      if (existingFavorite.data.includes(postId)) {
        existingFavorite.data.pull(postId);
        await existingFavorite.save();
        return res.status(200).json({ message: "Đã Hủy Theo Dõi" });
      }

      existingFavorite.data.push(postId);
      await existingFavorite.save();

      return res
        .status(201)
        .json({ message: "Yêu thích đã được tạo thành công" });
    }

    const newFavorite = new Favorite({
      user: req.user._id,
      data: [postId],
    });

    await newFavorite.save();

    return res
      .status(201)
      .json({ message: "Yêu thích đã được tạo thành công" });
  } catch (error) {
    return res.status(500).json({
      message: "Đã có lỗi xảy ra khi tạo yêu thích",
      error: error.message,
    });
  }
};

const getPostFavorite = async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await Favorite.findOne({ user: userId })
      .populate({
        path: "data",
        select: [
          "title",
          "caption",
          "body",
          "photo",
          "slug",
          "checked",
          "averageRating",
          "createdAt",
        ],
      })
      .populate("user", "name");

    res.status(200).json(favorites);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Lỗi khi lấy danh sách favorite." });
  }
};
export { createFavorite, getPostFavorite };

export const getFavoritesByPostId = async (req, res, next) => {
  try {
    const postId = req.params.postId; // Assuming post ID is available in req.params.postId

    const favorites = await Favorite.find({ data: postId }).populate("user", [
      "avatar",
      "name",
    ]);

    return res.json(favorites);
  } catch (error) {
    next(error);
  }
};
