import { Router } from "express";
import dotenv from "dotenv";
dotenv.config();
import userController from "../controllers/user.js";
import userMiddleware from "../middlewares/user.js";
import { validateToken } from "../middlewares/token.js";

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(JSON.parse(process.env.CLOUDINARY_CONFIG));

const UserRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

UserRouter.get("", userController.allUser);
UserRouter.post(
  "/register",
  userMiddleware.createUser,
  userController.createUser
);
UserRouter.post("/login", userMiddleware.login, userController.login);
UserRouter.put(
  "/update/:email",
  userMiddleware.updateUserInfo,
  userController.updateUserInfo
);
// UserRouter.put(
//   "/update/avatar/:userId",
//   upload.single("avatar"),
//   userController.updateAvatar
// );
// UserRouter.delete(
//   "/delete/:userId",
//   userMiddleware.deleteUser,
//   userController.deleteUser
// );
export default UserRouter;
