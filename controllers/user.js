import UserModel from "../models/user.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { SecretKey } from "../middlewares/token.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(JSON.parse(process.env.CLOUDINARY_CONFIG));
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const userController = {
  allUser: async (req, res) => {
    try {
      const allUsers = await UserModel.find().select("-password");
      res.status(200).send({
        message: "Success",
        data: allUsers,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  findUser: async (req, res) => {
    try {
      const {userId} = req.params;
      const user = await UserModel.findOne({ userId: userId });

      if (!user) {
        return res.status(404).send({
          message: "User not found",
          data: null,
        });
      }
      res.status(200).send({
        message: "Success",
        data: user,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },

  createUser: async (req, res) => {
    try {
      const { userName, email, password, phoneNumber } = req.body;

      // Hash password using argon2
      const hashedPassword = await argon2.hash(password);

      // Create user
      const createdUser = await UserModel.create({
        userName:userName,
        email:email,
        userId: crypto.randomUUID(),
        password: hashedPassword,
        phone:phoneNumber,
        address:"",
        role: "member",
      });

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: createdUser.userId,
          email: createdUser.email,
          role: createdUser.role,
        },
        SecretKey,
        { expiresIn: "24h" }
      );

      // Remove password from response
      const userResponse = createdUser.toObject();
      delete userResponse.password;

      res.status(200).send({
        message: "User created successfully",
        data: userResponse,
        token,
      });
    } catch (error) {
      res.status(400).send({
        message: error.message,
        data: null,
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const currentUser = await UserModel.findOne({ email });
      if (!currentUser) {
        throw new Error("Invalid email or password");
      }

      // Verify password using argon2
      const isValidPassword = await argon2.verify(currentUser.password, password);
      if (!isValidPassword) {
        throw new Error("Invalid email or password");
      }

      // Generate tokens
      const user = {
        userId: currentUser.userId,
        email: currentUser.email,
        role: currentUser.role,
      };

      const accessToken = jwt.sign(user, SecretKey, {
        expiresIn: "1h",
      });

      const refreshToken = jwt.sign(user, SecretKey, {
        expiresIn: "7d",
      });

      // Remove password from response
      const userResponse = currentUser.toObject();
      delete userResponse.password;

      res.status(200).send({
        message: "Login successful",
        data: userResponse,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      res.status(401).send({
        message: error.message,
        data: null,
      });
    }
  },

  updateUserInfo : async (req, res) => {
    try {
      const updates = req.body; // Dữ liệu cần cập nhật từ body
      const { email } = req.params; // Email của user cần cập nhật
  
      // 1. Kiểm tra người dùng có tồn tại không
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Không tồn tại người dùng" });
      }
  
      // 2. Danh sách key hợp lệ từ schema
      const validFields = Object.keys(UserModel.schema.paths);
  
      // 3. Kiểm tra xem tất cả các key trong updates có hợp lệ không
      const allKeysValid = Object.keys(updates).every((key) => validFields.includes(key));
      if (!allKeysValid) {
        return res.status(400).json({ message: "Có trường không hợp lệ, không thể cập nhật" });
      }
  
      // 4. Kiểm tra định dạng số điện thoại
      if (updates.phone) {
        const phoneRegex = /^(0|\+84)[1-9]\d{8,9}$/;
        if (!phoneRegex.test(updates.phone)) {
          return res.status(400).json({ message: "Số điện thoại không hợp lệ" });
        }
      }
  
      // 5. Kiểm tra dữ liệu có bị trùng với người dùng khác không
      for (const [key, value] of Object.entries(updates)) {
        if (["email", "phone", "userId"].includes(key)) {
          const existingUser = await UserModel.findOne({ [key]: value, email: { $ne: email } });
          if (existingUser) {
            return res.status(400).json({ message: `Dữ liệu trùng lặp: ${key} đã tồn tại` });
          }
        }
      }
  
      // 6. Cập nhật thông tin user
      const updatedUser = await UserModel.findOneAndUpdate(
        { email }, // Điều kiện tìm kiếm
        { $set: updates }, // Cập nhật dữ liệu hợp lệ
        { new: true, select: "-password" } // Trả về user mới, bỏ password
      );
  
      res.status(200).json({
        message: "Cập nhật thông tin thành công",
        data: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateAvatar: async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId.includes("=")) {
        throw new Error("Invalid format for userId");
      }
      const updateId = userId.split("=")[1];
      if (!userId.split("=")[0].includes("userId")) {
        throw new Error("Invalid format for userId");
      }
      const avatar = req.file;
      if (!avatar) throw new Error("Please update your avatar");
      const crrUser = await UserModel.findOne({ userId: updateId });
      if (!crrUser) {
        res.status(404).send({
          message: "User not found",
          data: null,
        });
      } else {
        if (avatar) {
          const dataUrl = `data:${
            avatar.mimetype
          };base64,${avatar.buffer.toString("base64")}`;
          const result = await cloudinary.uploader.upload(dataUrl, {
            resource_type: "auto",
          });
          if (!result || !result.url) {
            return res.status(500).send({
              message: "Failed to upload avatar",
              data: null,
            });
          }
          if (result && result.url) {
            crrUser.avatar = result.url;
          }
        }
        await crrUser.save();
        res.status(201).send({
          message: "Updated",
          data: crrUser,
        });
      }
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId.includes("=")) {
        throw new Error("Invalid format for userId");
      }
      const deleteId = userId.split("=")[1];
      if (!userId.split("=")[0].includes("userId")) {
        throw new Error("Invalid format for userId");
      }
      const deleteUser = await UserModel.findOne({ userId: deleteId });

      if (!deleteUser) {
        return res.status(404).send({
          message: "User not found!",
          data: null,
        });
      }
      await UserModel.findOneAndDelete({ userId: deleteId });
      res.status(200).send({
        message: "Thanh Cong",
        data: deleteUser,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
};

export default userController;
