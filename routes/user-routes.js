const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/user-controller");
const { userAuthVerification } = require("../middlewares/userAuth-middleware");

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.post("/auth", userAuthVerification);

module.exports = { userRouter };
