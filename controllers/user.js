import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SecretKey } from "../middlewares/token.js";
import crypto from 'crypto';
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
      const allUsers = await UserModel.find().select('-password');
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

  createUser: async (req, res) => {
    try {
      const { userName, email, password } = req.body;
      
      // Check if user exists
      const existingUser = await UserModel.findOne({ 
        $or: [{ email }, { userName }] 
      });
      if (existingUser) {
        throw new Error(existingUser.email === email ? 
          "Email already exists" : "Username already exists");
      }

      // Hash password
      const hashedPassword = bcrypt.hashSync(password, 10);
      
      // Create user
      const createdUser = await UserModel.create({
        userName,
        email,
        userId: crypto.randomUUID(),
        password: hashedPassword,
      });

      // Remove password from response
      const userResponse = createdUser.toObject();
      delete userResponse.password;

      res.status(201).send({
        message: "User created successfully",
        data: userResponse,
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

      // Verify password
      const comparedPassword = bcrypt.compareSync(password, currentUser.password);
      if (!comparedPassword) {
        throw new Error("Invalid email or password");
      }

      // Generate tokens
      const user = {
        userId: currentUser.userId,
        email: currentUser.email,
        role: currentUser.role
      };

      const accessToken = jwt.sign(user, SecretKey, {
        expiresIn: '1h'
      });

      const refreshToken = jwt.sign(user, SecretKey, {
        expiresIn: '7d'
      });

      // Remove password from response
      const userResponse = currentUser.toObject();
      delete userResponse.password;

      res.status(200).send({
        message: "Login successful",
        data: userResponse,
        accessToken,
        refreshToken
      });
    } catch (error) {
      res.status(401).send({
        message: error.message,
        data: null,
      });
    }
  },

  updateUserName: async (req, res) => {
    try {
      const { userName } = req.params;
      const { userId } = req.body;

      if (!userName.includes("=")) {
        throw new Error("Invalid format for userName");
      }

      const newName = userName.split("=")[1];
      if (!userName.split("=")[0].includes("userName")) {
        throw new Error("Invalid format for userName");
      }

      // Check if new username already exists
      const existingUser = await UserModel.findOne({ userName: newName });
      if (existingUser) {
        throw new Error("Username already exists");
      }

      const updatedUser = await UserModel.findOneAndUpdate(
        { userId },
        { userName: newName },
        { new: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).send({
          message: "User not found",
          data: null,
        });
      }

      res.status(200).send({
        message: "Username updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      res.status(400).send({
        message: error.message,
        data: null,
      });
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
