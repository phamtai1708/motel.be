import mongoose from "mongoose";
const landSchema = new mongoose.Schema({
  address:{type:String, default:""},
  price:{type:String, default:""},
  userId:{type:String, default:""},
  room:Number,
  toilet:Number,
  air:Number,
  images:{type:Array,default:[]},
  water:Number,
  bed:Number,
  wardrobe:Number,
  chdv:{type:Boolean, default:false},
  status: {type:String, default:"Còn trống"},
  description:{type:String, default:""},
});
const LandModel = mongoose.model("lands", landSchema);
export default LandModel;
