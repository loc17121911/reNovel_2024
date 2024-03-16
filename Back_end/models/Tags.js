import { Schema, model } from "mongoose";

const TagsSchema = new Schema(
  {
    title: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);
const Tags = model("Tags", TagsSchema);
export default Tags;
