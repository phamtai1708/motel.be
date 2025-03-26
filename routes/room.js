import { Router } from "express";
import dotenv from "dotenv";
dotenv.config();
import roomController from "../controllers/room.js";
import roomMiddleware from "../middlewares/room.js";
import { validateToken } from "../middlewares/token.js";

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(JSON.parse(process.env.CLOUDINARY_CONFIG));

const RoomRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

RoomRouter.get("", roomController.allRoom);
RoomRouter.post(
  "/registerRoom",
  roomMiddleware.createRoom,
  roomController.createRoom
);

export default RoomRouter;
