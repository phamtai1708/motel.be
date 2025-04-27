import LandModel from "../models/land.js";
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
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

const landController = {
  allLand: async (req, res) => {
    try {
      const allLands = await LandModel.find();
      res.status(200).send({
        message: "Success",
        data: allLands,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  findLand: async (req, res) => {
    try {
      const {value}= req.params;
      console.log(value);
      res.status(200).send({
        message: "Success",
        data: allLands,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  renderLand: async (req, res) => {
    try {
      const {landId} = req.params;
    
      // Kiểm tra xem `landId` có hợp lệ không
      if (!mongoose.Types.ObjectId.isValid(landId)) {
        return res.status(400).json({
          message: "Invalid landId format",
          data: null,
        });
      }

      const findLand = await LandModel.findById(landId);
      if (!findLand) {
        return res.status(404).json({
          message: "Land not found",
          data: null,
        });
      }
      res.status(200).send({
        message: "Success",
        data: findLand,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  createLand: async (req, res) => {
    try {
      const {
        address,
        userId,
        price,
        room,
        toilet,
        air,
        water,
        bed,
        wardrobe,
        chdv,
      } = req.body;
      const files = req.files; // Lấy danh sách file từ req.files

      if (!files || files.length === 0) {
        return res.status(400).send({
          message: "No images uploaded",
          data: null,
        });
      }

      // Upload từng file lên Cloudinary và lấy URL
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

      // Tạo mới Land với danh sách ảnh
      const createdLand = await LandModel.create({
        address,
        userId,
        price,
        room,
        toilet,
        air,
        water,
        bed,
        wardrobe,
        chdv: chdv || false,
        images: imageUrls, // Lưu danh sách URL hình ảnh
      });

      res.status(201).send({
        message: "Land created successfully",
        data: createdLand,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  deletedLand: async (req, res) => {
    try {
      const { landId } = req.params; // Lấy id từ params

      // Kiểm tra xem `landId` có hợp lệ không
      if (!mongoose.Types.ObjectId.isValid(landId)) {
        return res.status(400).json({
          message: "Invalid landId format",
          data: null,
        });
      }

      // Tìm và xóa Land trong database
      const deletedLand = await LandModel.findByIdAndDelete(landId);

      if (!deletedLand) {
        return res.status(404).json({
          message: "Land not found",
          data: null,
        });
      }

      res.status(200).json({
        message: "Land deleted successfully",
        data: deletedLand,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        data: null,
      });
    }
  },
  updateLandImage: async (req, res) => {
    try {
      const { landId } = req.params;
      const { deleteImages } = req.body;
      const listImages = deleteImages.split(",");
      const files = req.files;

      console.log(files);
      const land = await LandModel.findById(landId);
      if (!land) {
        return res.status(404).json({ message: "Land not found", data: null });
      }

      let updatedImages = [...land.images];

      // Xoá ảnh cũ
      if (listImages && listImages.length > 0) {
        for (const imgUrl of listImages) {
          const xxx = imgUrl.split("/")[7];
          const publicId = xxx.split(".")[0];
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
            updatedImages = updatedImages.filter((img) => img !== imgUrl);
          }
        }
      }
      
      // Upload ảnh mới
      if (files && files.length > 0) {
        for (const file of files) {
          const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
            "base64"
          )}`;
          const result = await cloudinary.uploader.upload(dataUrl, {
            resource_type: "auto",
          });
          if (result && result.secure_url) {
            updatedImages.push(result.secure_url);
          }
        }
      }
      // // Upload từng file lên Cloudinary và lấy URL
      // const imageUrls = await Promise.all(
      //   files.map(async (file) => {
      //     const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
      //       "base64"
      //     )}`;
      //     const result = await cloudinary.uploader.upload(dataUrl, {
      //       resource_type: "auto",
      //     });
      //     return result.url;
      //   })
      // );

      const updatedLand = await LandModel.findByIdAndUpdate(
        landId,
        { images: updatedImages },
        { new: true }
      );

      res.status(200).json({
        message: "Images updated successfully",
        data: updatedLand,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        data: null,
      });
    }
  },
  updateLandInfo: async (req, res) => {
    try {
      const { landId } = req.params;
      const updates = req.body;
      // address,price,userId,room,toilet,air, water, bed, wardrobe,chdv

      // Tìm Land cần cập nhật
      const land = await LandModel.findById(landId);
      if (!land) {
        return res.status(404).json({ message: "Land not found", data: null });
      }

      // Lấy danh sách key hợp lệ từ schema
      const validFields = Object.keys(LandModel.schema.paths);
      // Kiểm tra tất cả key có hợp lệ không
      const allKeysValid = Object.keys(updates).every((key) =>
        validFields.includes(key)
      );
      if (!allKeysValid) {
        return res.status(400).json({
          message: "Có trường không hợp lệ, không thể cập nhật",
          data: null,
        });
      }

      // Cập nhật Land
      const updatedLand = await LandModel.findByIdAndUpdate(
        landId, // Điều kiện tìm kiếm
        { $set: updates }, // Cập nhật dữ liệu hợp lệ
        { new: true } // Trả về Land đã cập nhật
      );

      res.status(200).json({
        message: "Land updated successfully",
        data: updatedLand,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        data: null,
      });
    }
  },
};

export default landController;
