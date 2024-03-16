import { Schema, model } from "mongoose";

const FavoriteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    data: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: true,
  }
);

const Favorite = model("Favorite", FavoriteSchema);
export default Favorite;
