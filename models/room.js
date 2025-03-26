import mongoose from "mongoose";
const roomSchema = new mongoose.Schema({
  adress:{type:String, default:""},
  roomId:String,
  landId:String,
  userId:String,
  price:{type:String, default:""},
  toilet:Number,
  air:Number,
  water:Number,
  bed:Number,
  wardrobe:Number,
  description:{
    type:String,
    default:""
  }
});
const RoomModel = mongoose.model("rooms", roomSchema);
export default RoomModel;
