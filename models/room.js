import mongoose from "mongoose";
const roomSchema = new mongoose.Schema({
  address:{type:String, default:""},
  roomId:String,
  landId:{type:String, default:""},
  userId:{type:String, default:""},
  price:{type:String, default:""},
  toilet:{type:Number,default:0},
  air:{type:Number,default:0},
  water:{type:Number,default:0},
  bed:{type:Number,default:0},
  bedroom:{type:Number,default:0},
  wardrobe:{type:Number,default:0},
  vskk:{type:Boolean, default:true},
  vsc:Number,
  images:{type:Array, default:[]},
  status: {type:String, default:"Còn trống"},
  description:{
    type:String,
    default:""
  }
});
const RoomModel = mongoose.model("rooms", roomSchema);
export default RoomModel;
