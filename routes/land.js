import express from "express";
import dotenv from "dotenv";
dotenv.config();
import landController from "../controllers/land.js";
import landMiddleware from "../middlewares/land.js";
import { validateToken } from "../middlewares/token.js";

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(JSON.parse(process.env.CLOUDINARY_CONFIG));

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10, // Maximum 10 files
  },
});

const router = express.Router();


router.get("/allLand", landController.allLand);
router.get(
  "/:landId",
  landController.renderLand
);
router.get(
  "/:value",
  landController.findLand
);
router.post(
  "/createLand",
  upload.array("images", 10), // Accept up to 10 images
  landMiddleware.createLand,
  landController.createLand
);
router.put(
  "/updateLandImage/:landId",
  upload.array("images", 10),
  landMiddleware.updateLandImage,
  landController.updateLandImage
);
router.put(
  "/updateLandInfo/:landId",
  upload.array("images", 10),
  landMiddleware.updateLandInfo,
  landController.updateLandInfo
);
router.delete(
  "/deletedLand/:landId",
  landController.deletedLand
);

export default router;
