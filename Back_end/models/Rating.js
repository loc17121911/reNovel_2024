import { Schema, model } from "mongoose";

const RatingSchema = new Schema({
    score: Number,
    user: { type: Schema.Types.ObjectId, ref: "User" },
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
  });
const Rating = model("Rating", RatingSchema);
export default Rating;