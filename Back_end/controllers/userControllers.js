import uploadAvatar from "../middleware/uploadAvatarMiddleware";
import Comment from "../models/Comment";
import Post from "../models/Post";
import User from "../models/User";
import fileRemove from "../utils/fileRemove";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // check
    let user = await User.findOne({ email });

    if (user) {
      // return res.status(400).json({ message: "Email đã được đăng ký" });
      throw new Error("Email đã được đăng ký");
    }

    // create New
    user = await User.create({
      name,
      email,
      password,
    });

    return res.status(201).json({
      _id: user._id,
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      verified: user.verified,
      admin: user.admin,
      check: user.check,
      token: await user.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      throw new Error("Khong tim thay email");
    }

    if (await user.comparePassword(password)) {
      return res.status(201).json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        verified: user.verified,
        admin: user.admin,
        check: user.check,
        token: await user.generateJWT(),
      });
    } else {
      throw new Error("Email hoac mat khau sai");
    }
  } catch (error) {
    next(error);
  }
};

export const userProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);

    if (user) {
      return res.status(201).json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        verified: user.verified,
        admin: user.admin,
      });
    } else {
      let error = new Error("Khong tim thay tai khoan");
      error.statusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);

    if (!user) {
      throw new Error("Khong tim thay tai khoan");
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password && req.body.password.length < 6) {
      throw new Error("Mat khau cua ban phai dai hon 6");
    } else if (req.body.password) {
      user.password = req.body.password;
    }

    user.verified = req.body.verified || user.verified;

    const updateUserProfile = await user.save();
    res.json({
      _id: updateUserProfile._id,
      avatar: updateUserProfile.avatar,
      name: updateUserProfile.name,
      email: updateUserProfile.email,
      check: updateUserProfile.check,
      admin: updateUserProfile.admin,
      token: await updateUserProfile.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfileAvatar = async (req, res, next) => {
  try {
    const upload = uploadAvatar.single("profileAvatar");

    upload(req, res, async function (err) {
      if (err) {
        const error = new Error("Không thể upload Avatar" + err.message);
        return next(error);
      } else {
        if (req.file) {
          let filename;
          let updateUser = await User.findById(req.user._id);
          filename = updateUser.avatar;
          if (filename) {
            fileRemove(filename);
          }
          updateUser.avatar = req.file.filename;
          await updateUser.save();
          res.json({
            _id: updateUser._id,
            avatar: updateUser.avatar,
            name: updateUser.name,
            email: updateUser.email,
            verified: updateUser.verified,
            admin: updateUser.admin,
            token: await updateUser.generateJWT(),
          });
        } else {
          let filename;
          let updateUser = await User.findById(req.user._id);
          filename = updateUser.avatar;
          updateUser.avatar = "";
          await updateUser.save();
          fileRemove(filename);
          res.json({
            _id: updateUser._id,
            avatar: updateUser.avatar,
            name: updateUser.name,
            email: updateUser.email,
            verified: updateUser.verified,
            admin: updateUser.admin,
            token: await updateUser.generateJWT(),
          });
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ check: -1 });
    return res.json(users);
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (req, res, next) => {
  try {
    const userId = await req.params.userId;

    await User.deleteOne({ _id: userId });
    await Post.deleteMany({ user: userId._id });
    await Comment.deleteMany({ user: userId._id });

    res.send({
      message: "Taì khoản này đã được xóa !",
    });
  } catch (error) {
    next(error);
  }
};

export const updateCheck = async (req, res) => {
  const userId = await req.params.userId;
  const { check } = req.body;

  try {
    // Tìm người dùng theo userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    // Cập nhật trường "check" cho người dùng
    user.check = check;
    await user.save();

    return res.status(201).json({
      _id: user._id,
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      verified: user.verified,
      admin: user.admin,
      check: user.check,
      token: await user.generateJWT(),
    });
  } catch (error) {
    return res.status(500).json({ error: "Lỗi server" });
  }
};
