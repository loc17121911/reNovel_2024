import fs from "fs";
import path from "path";

const fileRemove = (filename) => {
  fs.unlink(path.join(__dirname, "../uploads", filename), function (err) {
    if (err && err.code == "ENOENT") {
      console.log(`FILE ${filename} không tồn tại, không thể xóa nó.`);
    } else if (err) {
      console.log(`Đã xảy ra lỗi khi cố gắng xóa tệp ${filename}.`);
    } else {
      console.log(`Đã xóa tệp ${filename}.`);
    }
  });
};

export default fileRemove;