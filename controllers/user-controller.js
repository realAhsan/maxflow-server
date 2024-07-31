const Joi = require("joi");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const generateToken = (id) => {
  return jwt.sign({ id }, "$UPERMANBADMAN", {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

const registerUser = async function (req, res, next) {
  try {
    const { name, email, password } = await req.body;
    console.log("req body", req.body);

    const { error } = registerSchema.validate({
      name,
      email,
      password,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const emailAlreadyExist = await User.findOne({ email });

    if (emailAlreadyExist) {
      return res.status(400).json({
        success: false,
        message: "Email already exist",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      const token = generateToken(newUser?._id);
      res.cookie("token", token, {
        httpOnly: true,
        secure: "production",
        sameSite: "None",
      });
      return res.status(201).json({
        success: true,
        message: "User created successfully",
        userData: {
          name: newUser.name,
          email: newUser.email,
          _id: newUser._id,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went Wrong! please try again",
    });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { error } = loginSchema.validate({
      email,
      password,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email don't exist",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }
    const token = generateToken(user?._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
      secure: "production",
      sameSite: "None",
    });
    return res.status(201).json({
      success: true,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went Wrong! please try again",
    });
  }
};

async function logoutUser(req, res) {
  try {
    res.cookie("token", "", {
      withCredentials: true,
      httpOnly: false,
    });

    return res.status(200).json({
      success: true,
      message: "logout successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went Wrong! please try again",
    });
  }
}

module.exports = { registerUser, loginUser, logoutUser };
