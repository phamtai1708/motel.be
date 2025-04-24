import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: { 
    type: String, 
    default: "",
    unique: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid phone number']
  },
  avatar: { 
    type: String, 
    default: "" 
  },
  userId: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    default: "member",
    enum: ["member","landlord","worker", "admin"]
  },
  address: {
    type: String,
    default: ""
  },
  land: {
    type: [String],
    default: []
  },
  room: {
    type: [String],
    default: []
  },
  favorite: { 
    type: [String], 
    default: [] 
  }
}, {
  timestamps: true
});

const UserModel = mongoose.model("users", userSchema);
export default UserModel;
