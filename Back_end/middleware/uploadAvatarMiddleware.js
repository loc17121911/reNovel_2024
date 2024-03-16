import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const uploadAvatar = multer({
  storage: storage,
  limits: {
    fileSize: 3 * 1000000,
  },
  fileFilter: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return cb(new Error("Bạn hãy chọn 1 tấm ảnh hợp lệ"));
    }
    cb(null, true);
  },
});

export default uploadAvatar;
