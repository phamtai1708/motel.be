import mongoose from "mongoose";
import multer from "multer";
const landMiddleware = {
  createLand: (req, res, next) => {
    try {
      const { address, userId, price, room, toilet, air, water, bed, wardrobe} = req.body;
      
      const files = req.files; 
      console.log(req.files);
      
      // Validate required fields
      if (!address) throw new Error("Address is required");
      if (!userId) throw new Error("User ID is required");
      if (!price) throw new Error("Price is required");
      if (!files || files.length === 0) throw new Error("Images is required");

      // Validate numeric fields
      if (isNaN(room) || room < 0) throw new Error("Invalid room value");
      if (isNaN(toilet) || toilet < 0) throw new Error("Invalid toilet value");
      if (isNaN(air) || air < 0) throw new Error("Invalid air value");
      if (isNaN(water) || water < 0) throw new Error("Invalid water value");
      if (isNaN(bed) || bed < 0) throw new Error("Invalid bed value");
      if (isNaN(wardrobe) || wardrobe < 0) throw new Error("Invalid wardrobe value");

      return next();
    } catch (error) {
      res.status(400).send({
        message: error.message,
        data: null,
      });
    }
  },
  updateLandImage: (req, res, next) => {
    try {
      const { landId } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(landId)) {
        return res.status(400).json({
          message: "Invalid landId format",
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
  updateLandInfo: (req, res, next) => {
    try {
      const { landId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(landId)) {
        return res.status(400).json({
          message: "Invalid landId format",
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

export default landMiddleware;
