import RoomModel from "../models/room.js";
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
      const { adress, landId, userId, price, toilet, air, water, bed, wardrobe, description } = req.body;
      
      const createdRoom = await RoomModel.create({
        adress,
        roomId: crypto.randomUUID(),
        landId,
        userId,
        price,
        toilet,
        air,
        water,
        bed,
        wardrobe,
        description
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
  }
};

export default roomController;
