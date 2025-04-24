import RoomModel from "../models/room.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SecretKey } from "../middlewares/token.js";
import crypto from "crypto";
import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(JSON.parse(process.env.CLOUDINARY_CONFIG));
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const roomController = {
  allRoom: async (req, res) => {
    try {
      const allRooms = await RoomModel.find();
      res.status(200).send({
        message: "Success",
        data: allRooms,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },

  createRoom: async (req, res) => {
    try {
      const {
        address,
        landId,
        userId,
        price,
        bedroom,
        air,
        water,
        bed,
        wardrobe,
        vskk,
        vsc,
        toilet,
        description,
      } = req.body;
      const files = req.files;

      const imageUrls = await Promise.all(
        files.map(async (file) => {
          const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
            "base64"
          )}`;
          const result = await cloudinary.uploader.upload(dataUrl, {
            resource_type: "auto",
          });
          return result.url;
        })
      );
      const createdRoom = await RoomModel.create({
        address,
        roomId: crypto.randomUUID(),
        landId,
        userId,
        bedroom,
        price,
        toilet,
        air,
        water,
        vskk,
        vsc,
        bed,
        wardrobe,
        description,
        images: imageUrls,
      });

      res.status(201).send({
        message: "Room created successfully",
        data: createdRoom,
      });
    } catch (error) {
      res.status(400).send({
        message: error.message,
        data: null,
      });
    }
  },
  deleteRoom: async (req, res) => {
    try {
      const { roomId } = req.params; // Lấy id từ params
      const {userId} = req.body;
      if (!userId) throw new Error("User ID is required");

      // Kiểm tra xem `landId` có hợp lệ không
      if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return res.status(400).json({
          message: "Invalid roomId format",
          data: null,
        });
      }

      const findRoom = await RoomModel.findById(roomId);
      if (!findRoom) {
        return res.status(404).json({
          message: "Room not found",
          data: null,
        });
      }
      if (!userId === findRoom.userId) throw new Error ("userId không chính xác")
      // Tìm và xóa Land trong database
      const deletedRoom = await RoomModel.findByIdAndDelete(roomId);

      res.status(200).json({
        message: "Room deleted successfully",
        data: deletedRoom,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        data: null,
      });
    }
  },
  updateRoomImage: async (req, res) => {
    try {
      const { roomId } = req.params;
      const files = req.files;
      
      // Validate roomId
      if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return res.status(400).json({
          message: "Invalid roomId format",
          data: null,
        });
      }
      
      // Find room
      const findRoom = await RoomModel.findById(roomId);
      if (!findRoom) {
        return res.status(404).json({
          message: "Room not found",
          data: null,
        });
      }
      
      // Check if files exist
      if (!files || files.length === 0) {
        return res.status(400).json({
          message: "No images uploaded",
          data: null,
        });
      }
      
      // Upload new images to Cloudinary
      const newImageUrls = await Promise.all(
        files.map(async (file) => {
          const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
            "base64"
          )}`;
          const result = await cloudinary.uploader.upload(dataUrl, {
            resource_type: "auto",
          });
          return result.url;
        })
      );
      
      // Combine existing images with new images
      const existingImages = findRoom.images || [];
      const updatedImages = [...existingImages, ...newImageUrls];
      
      // Update room with combined image URLs
      const updatedRoom = await RoomModel.findByIdAndUpdate(
        roomId,
        { images: updatedImages },
        { new: true }
      );
      
      res.status(200).json({
        message: "Room images updated successfully",
        data: updatedRoom,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        data: null,
      });
    }
  },
  deleteRoomImage: async (req, res) => {
    try {
      const { roomId } = req.params; // Lấy id từ params
      const { userId, deleteImage } = req.body;
      
      console.log(deleteImage);
      // Validate input
      if (!userId) throw new Error("User ID is required");
      if (!deleteImage || !Array.isArray(deleteImage) || deleteImage.length === 0) {
        return res.status(400).json({
          message: "deleteImage must be a non-empty array",
          data: null,
        });
      }
      
      // Validate roomId
      if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return res.status(400).json({
          message: "Invalid roomId format",
          data: null,
        });
      }

      // Find room
      const findRoom = await RoomModel.findById(roomId);
      if (!findRoom) {
        return res.status(404).json({
          message: "Room not found",
          data: null,
        });
      }
      
      // Validate userId
      if (userId !== findRoom.userId) {
        return res.status(403).json({
          message: "User ID không chính xác",
          data: null,
        });
      }
      
      // Get current images
      const currentImages = findRoom.images || [];
      
      // Check if all images to delete exist in the room
      const invalidImages = deleteImage.filter(imgUrl => !currentImages.includes(imgUrl));
      if (invalidImages.length > 0) {
        return res.status(400).json({
          message: "One or more image URLs are not valid for this room",
          data: {
            invalidImages
          }
        });
      }
      
      // Delete images from Cloudinary
      try {
        for (const imgUrl of deleteImage) {
          // Extract public_id from URL
          const urlParts = imgUrl.split('/');
          const fileName = urlParts[urlParts.length - 1];
          const publicId = fileName.split('.')[0];
          
          // Delete from Cloudinary
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (cloudinaryError) {
        console.error("Error deleting from Cloudinary:", cloudinaryError);
        // Continue processing even if Cloudinary deletion fails
      }
      
      // Update images array in MongoDB
      const updatedImages = currentImages.filter(img => !deleteImage.includes(img));
      
      // Update room with new images array
      const updatedRoom = await RoomModel.findByIdAndUpdate(
        roomId,
        { images: updatedImages },
        { new: true }
      );

      res.status(200).json({
        message: "Room images deleted successfully",
        data: updatedRoom,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        data: null,
      });
    }
  },
  
};

export default roomController;
