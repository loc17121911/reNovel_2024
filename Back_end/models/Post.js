import { Schema, model } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, default: "" },
    caption: { type: String, require: true },
    slug: { type: String, require: true, unique: true },
    body: { type: Object, require: true },
    photo: { type: String, require: false },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    tags: { type: Schema.Types.ObjectId, ref: "Tags" },
    category: [{ type: Schema.Types.ObjectId, ref: "PostCategory" }],
    averageRating: { type: Number, default: 0 },
    view: { type: Number, default: 0 },
    country: { type: String, default: "" },
    status: { type: String, default: "" },
    checked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
PostSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
});

const Post = model("Post", PostSchema);
export default Post;
