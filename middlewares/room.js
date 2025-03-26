const roomMiddleware = {
  createRoom: (req, res, next) => {
    try {
      const { adress, landId, userId, price, toilet, air, water, bed, wardrobe, description } = req.body;
      
      // Validate required fields
      if (!adress) throw new Error("Address is required");
      if (!landId) throw new Error("Land ID is required");
      if (!userId) throw new Error("User ID is required");
      if (!price) throw new Error("Price is required");

      // Validate numeric fields
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
  }
};

export default roomMiddleware;
