const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuthVerification = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({
        message: "Unauthorized",
        success: false,
      });
    }
    if (token) {
      try {
        const decoded = jwt.verify(token, "$UPERMANBADMAN");
        const user = await User.findById(decoded.id);
        if (user) {
          return res.status(200).json({
            success: true,
            user,
          });
        }
      } catch (error) {
        return res.json({
          message: "Unauthorized",
          success: false,
        });
      }
    }
  } catch (error) {}
};

module.exports = { userAuthVerification };
