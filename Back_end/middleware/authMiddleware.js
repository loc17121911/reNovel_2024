import { verify } from "jsonwebtoken";
import User from "../models/User";

export const authGuard = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { id } = verify(token, process.env.JWT_TOKEN);
      req.user = await User.findById(id).select("-password");
      next();
    } catch (error) {
      let err = new Error("Không thể xác thực token");
      err.statusCode = 401;
      next(err);
    }
  } else {
    let error = new Error("Không tìm thấy token");
    error.statusCode = 401;
    next(error);
  }
};

export const adminGuard = (req, res, next) => {
  if (req.user) {
    if (req.user.admin) {
      next(); // admin
    } else if (req.user.check === 2) {
      next(); // Thuyet Gia
    } else if (req.user.check === 1) {
      let error = new Error("Chờ Admin Cho phép đăng bài");
      error.statusCode = 401;
      next(error);
    } else {
      let error = new Error("Bạn không có quyền truy cập");
      error.statusCode = 401;
      next(error);
    }
  } else {
    let error = new Error("Bạn không phải là admin");
    error.statusCode = 401;
    next(error);
  }
};
