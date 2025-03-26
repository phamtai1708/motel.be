import { Router } from "express";
import dotenv from "dotenv";
dotenv.config();
import landController from "../controllers/land.js";
import landMiddleware from "../middlewares/land.js";
import { validateToken } from "../middlewares/token.js";

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(JSON.parse(process.env.CLOUDINARY_CONFIG));

const LandRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

LandRouter.get("", landController.allLand);
LandRouter.post(
  "/registerLand",
  landMiddleware.createLand,
  landController.createLand
);

export default LandRouter;
