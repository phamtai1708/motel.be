import mongoose from "mongoose";
const landSchema = new mongoose.Schema({
  adress:{type:String, default:""},
  price:{type:String, default:""},
  userId: String,
  room:Number,
  toilet:Number,
  air:Number,
  water:Number,
  bed:Number,
  wardrobe:Number,
});
const LandModel = mongoose.model("lands", landSchema);
export default LandModel;
