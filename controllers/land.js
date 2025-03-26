import LandModel from "../models/land.js";
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

  createLand: async (req, res) => {
    try {
      const { adress, userId, price, room, toilet, air, water, bed, wardrobe } = req.body;
      
      const createdLand = await LandModel.create({
        adress,
        userId,
        price,
        room,
        toilet,
        air,
        water,
        bed,
        wardrobe
      });

      res.status(201).send({
        message: "Land created successfully",
        data: createdLand,
      });
    } catch (error) {
      res.status(400).send({
        message: error.message,
        data: null,
      });
    }
  }
};

export default landController;
