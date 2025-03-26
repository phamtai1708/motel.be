const userMiddleware = {
  createUser: (req, res, next) => {
    try {
      const { userName, email, password } = req.body;
      
      // Validate required fields
      if (!userName) throw new Error("Username is required");
      if (!email) throw new Error("Email is required");
      if (!password) throw new Error("Password is required");

      // Validate format
      if (userName.length < 3) throw new Error("Username must be at least 3 characters");
      if (password.length < 6) throw new Error("Password must be at least 6 characters");
      
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) throw new Error("Invalid email format");

      return next();
    } catch (error) {
      res.status(400).send({
        message: error.message,
        data: null,
      });
    }
  },

  login: (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      // Validate required fields
      if (!email) throw new Error("Email is required");
      if (!password) throw new Error("Password is required");

      // Validate format
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) throw new Error("Invalid email format");
      if (password.length < 6) throw new Error("Password must be at least 6 characters");

      return next();
    } catch (error) {
      res.status(400).send({
        message: error.message,
        data: null,
      });
    }
  },

  updateUserName: (req, res, next) => {
    try {
      const { userId } = req.body;
      const { userName } = req.params;

      // Validate required fields
      if (!userId) throw new Error("User ID is required");
      if (!userName) throw new Error("New username is required");

      // Validate format
      if (!userName.includes("=")) throw new Error("Invalid format for userName");
      const newName = userName.split("=")[1];
      if (!userName.split("=")[0].includes("userName")) throw new Error("Invalid format for userName");
      if (newName.length < 3) throw new Error("Username must be at least 3 characters");

      return next();
    } catch (error) {
      res.status(400).send({
        message: error.message,
        data: null,
      });
    }
  },

  deleteUser: (req, res, next) => {
    try {
      const { userId } = req.params;
      
      // Validate required fields
      if (!userId) throw new Error("User ID is required");

      // Validate format
      if (!userId.includes("=")) throw new Error("Invalid format for userId");
      if (!userId.split("=")[0].includes("userId")) throw new Error("Invalid format for userId");

      return next();
    } catch (error) {
      res.status(400).send({
        message: error.message,
        data: null,
      });
    }
  },
};

export default userMiddleware;
