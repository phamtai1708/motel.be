import jwt from "jsonwebtoken";
export const SecretKey = "TAI_WEB92";
const validateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Tách access token từ chuỗi "Bearer {access_token}"
    // Xác thực access token
    jwt.verify(token, SecretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Access token is invalid" });
      } else {
        // Lưu thông tin người dùng từ access token vào req
        // tham số req sẽ được chuyển tiếp tới các handler tiếp theo
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Access token is missing" });
  }
};
export { validateToken };
