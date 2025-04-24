import mongoose from "mongoose";
import RoomModel from "../models/room.js";

const roomMiddleware = {
  createRoom: (req, res, next) => {
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
      console.log(req.body);
      if (!files || files.length === 0) {
        return res.status(400).send({
          message: "No images uploaded",
          data: null,
        });
      }
      // Validate required fields
      if (!address) throw new Error("Address is required");
      if (!userId) throw new Error("User ID is required");
      if (!price) throw new Error("Price is required");
      if (isNaN(bedroom) || bedroom < 0) throw new Error("Bedroom is required");

      if (!description) throw new Error("Description is required");
      // Validate numeric fields
      if (!vskk) throw new Error("Vskk is required");

      if (isNaN(vsc) || vsc < 0) throw new Error("Vsc is required");

      if (isNaN(bed) || bed < 0) throw new Error("Invalid bed value");

      if (isNaN(wardrobe) || wardrobe < 0)
        throw new Error("Invalid wardrobe value");

      if (isNaN(toilet) || toilet < 0) throw new Error("Invalid toilet value");
      if (isNaN(air) || air < 0) throw new Error("Invalid air value");
      if (isNaN(water) || water < 0) throw new Error("Invalid water value");
      return next();
    } catch (error) {
      res.status(400).send({
        message: error.message,
        data: null,
      });
    }
  },
  updateRoomImage: async (req, res, next) => {
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
      
      return next();
    } catch (error) {
      res.status(400).send({
        message: error.message,
        data: null,
      });
    }
  },
};

export default roomMiddleware;
