import path from "path";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { errHanlder, invalidPathHandler } from "./middleware/erroHanlder.js";
import cors from "cors";

// Router
import userRouter from "./router/userRouter.js";
import postRouter from "./router/postRouter.js";
import commentRouter from "./router/commentRouter.js";
// import categoryRouter from "./router/categoryRouter.js";
import postCategoryRouter from "./router/categoryRouter.js";
import ratingRouter from "./router/ratingRouter.js";
import favoriteRouter from "./router/favoriteRouter.js";
import tagsRouter from "./router/tagsRouter.js";

dotenv.config();
connectDB();
const app = express();
app.use(express.json());

// Sử dụng middleware cors
app.use(cors());

app.get("/", (req, res) => {
  res.send("Da ket noi");
});

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/post-category", postCategoryRouter);
app.use("/api/ratings", ratingRouter);
app.use("/api/favorites", favoriteRouter);
app.use("/api/tags", tagsRouter);

// staticapp.use("/api/favorites", favoriteRouter);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(invalidPathHandler);
app.use(errHanlder);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Chạy trên cổng ${PORT}`));
