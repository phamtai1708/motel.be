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
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10, // Maximum 10 files
  },
});

RoomRouter.get("", roomController.allRoom);
RoomRouter.post(
  "/createRoom",
  upload.array("images", 10),
  roomMiddleware.createRoom,
  roomController.createRoom
);
RoomRouter.get(
  "/:roomId",
  roomController.renderRoom
);
RoomRouter.delete(
  "/deleteRoom/:roomId",
  roomController.deleteRoom
);
RoomRouter.put(
  "/updateRoomImage/:roomId",
  upload.array("images", 10),
  roomMiddleware.updateRoomImage,
  roomController.updateRoomImage
);
RoomRouter.delete(
  "/deleteRoomImage/:roomId",
  roomController.deleteRoomImage
);

export default RoomRouter;
