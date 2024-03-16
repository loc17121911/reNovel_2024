
import { Schema, model } from "mongoose";

const PostCategorySchema = new Schema(
  {
    title: { type: String, default: "" },

  },
  {
    timestamps: true,
  }
);
const PostCategory = model("PostCategory", PostCategorySchema);
export default PostCategory;