const userMiddleware = {
  createUser: (req, res, next) => {
    try {
      const { userName, email, password,phoneNumber } = req.body;
      
      // Validate required fields
      if (!userName) throw new Error("Username is required");
      if (!email) throw new Error("Email is required");
      if (!password) throw new Error("Password is required");
      if (!phoneNumber) throw new Error("Phone number is required");

      // Validate format
      if (userName.length < 3) throw new Error("Username must be at least 3 characters");
      if (password.length < 6) throw new Error("Password must be at least 6 characters");
      if (phoneNumber.length < 10) throw new Error("Phone Number is invalid");

      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) throw new Error("Invalid email format");

      const phoneRegex = /^(0|\+84)[1-9]\d{8,9}$/;
      if (!phoneRegex.test(phoneNumber)) {
        throw new Error("Phone number is invalid (must be 10-11 digits and start with 0 or +84)");
      }


      
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

  updateUserInfo: (req, res, next) => {
    try {
      const valueUpdate = req.body;
      const { email } = req.params;
      

      // Validate required fields
      if (!email) throw new Error("Email is required");
     
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
