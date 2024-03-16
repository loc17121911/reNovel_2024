import uploadAvatar from "../middleware/uploadAvatarMiddleware";
import Comment from "../models/Comment";
import Post from "../models/Post";
// import User from "../models/User";
import fileRemove from "../utils/fileRemove";
import { v4 as uuidv4 } from "uuid";
import xlsx from "xlsx";

export const createPost = async (req, res, next) => {
  try {
    const post = new Post({
      title: "Sample title",
      caption: "Sample caption",
      slug: uuidv4(),
      body: {
        type: "doc",
        content: [],
      },
      photo: "",
      user: req.user._id,
    });

    const createPost = await post.save();
    return res.json(createPost);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      const error = new Error("Không tìm thấy bài đăng");
      next(error);
      return;
    }

    const upload = uploadAvatar.single("postImg");

    const handlerUploadPost = async (data) => {
      const {
        title,
        caption,
        slug,
        body,
        category,
        tags,
        country,
        status,
        checked,
      } = JSON.parse(data);
      post.title = title || post.title;
      post.caption = caption || post.caption;
      post.slug = slug || post.slug;
      post.body = body || post.body;
      post.tags = tags || post.tags;
      post.category = category || post.category;
      post.country = country || post.country;
      post.status = status || post.status;
      post.checked = checked || post.checked;

      const updatePost = await post.save();
      return res.json(updatePost);
    };

    upload(req, res, async function (err) {
      if (err) {
        const error = new Error("Không thể upload ảnh bài viết" + err.message);
        return next(error);
      } else {
        if (req.file) {
          let filename;
          filename = post.photo;
          if (filename) {
            fileRemove(filename);
          }
          post.photo = req.file.filename;
          handlerUploadPost(req.body.document);
        } else {
          let filename;
          filename = post.photo;
          post.photo = "";
          fileRemove(filename);
          handlerUploadPost(req.body.document);
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ slug: req.params.slug });

    if (!post) {
      const error = new Error("Không tìm ra bài viết");
      return next(error);
    }
    await Comment.deleteMany({ post: post._id });
    return res.json({
      message: "Bài đăng đã được xóa",
    });
  } catch (error) {
    next(error);
  }
};

export const getPostDetail = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate([
      {
        path: "user",
        select: ["avatar", "name"],
      },
      {
        path: "category",
        select: ["title"],
      },
      {
        path: "comments",
        match: {
          check: true,
          parent: null,
        },
        populate: [
          {
            path: "user",
            select: ["avatar", "name"],
          },
          {
            path: "replies",
            match: {
              check: true,
            },
            populate: {
              path: "user",
              select: ["avatar", "name"],
            },
          },
        ],
      },
    ]);
    if (!post) {
      const error = new Error("Không tìm thấy bài đăng");
      return next(error);
    }
    post.view += 1;
    await post.save();
    return res.json(post);
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyWord;
    const categoryFilter = req.query.category;
    const countryFilter = req.query.country;
    const statusFilter = req.query.status;
    const tagsFilter = req.query.tags;
    const sort = req.query.sort;
    let where = {};
    if (filter) {
      where.title = { $regex: filter, $options: "i" };
    }
    if (categoryFilter) {
      where.category = { $in: categoryFilter.split(",") };
    }
    if (countryFilter) {
      where.country = countryFilter;
    }
    if (statusFilter) {
      where.status = statusFilter;
    }
    if (tagsFilter) {
      where.tags = { $in: tagsFilter.split(",") }; // Filter by tags
    }

    let query = Post.find(where);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit);
    const skip = (page - 1) * pageSize;
    const total = await Post.find(where).countDocuments();
    const pages = Math.ceil(total / pageSize);

    if (sort === "titlePlus") {
      query = query.sort({ title: "asc" });
    } else if (sort === "titleDown") {
      query = query.sort({ title: "desc" });
    } else if (sort === "viewTop") {
      query = query.sort({ view: -1 });
    } else if (sort === "viewBot") {
      query = query.sort({ view: 1 });
    } else {
      // Sắp xếp mặc định theo thời gian tạo (updatedAt)
      query = query.sort({ createdAt: "desc" });
    }

    res.header({
      // "x-filter": filter,
      "x-filter": encodeURIComponent(filter),
      "x-totalcount": JSON.stringify(total),
      "x-currentpage": JSON.stringify(page),
      "x-pagesize": JSON.stringify(pageSize),
      "x-totalpagecount": JSON.stringify(pages),
    });

    if (page > pages) {
      return res.json([]);
    }

    const result = await query
      .skip(skip)
      .limit(pageSize)
      .populate([
        {
          path: "user",
          select: ["avatar", "name", "verified"],
        },
        {
          path: "category",
          select: ["title"],
        },
        {
          path: "tags",
          select: ["title"],
        },
      ])
      .sort({ updatedAt: "desc" });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getPostUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const posts = await Post.find({ user: userId }).populate([
      {
        path: "user",
        select: ["avatar", "name"],
      },
      {
        path: "tags",
        select: "title",
      },
    ]);

    return res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const checkMutilPost = async (req, res, next) => {
  const { postIds } = req.body;

  try {
    const posts = await Post.find({ _id: { $in: postIds } });

    posts.forEach(async (post) => {
      post.checked = !post.checked;
      await post.save();
    });

    res.status(200).json({ message: "Checked status updated successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating checked status." });
  }
};
