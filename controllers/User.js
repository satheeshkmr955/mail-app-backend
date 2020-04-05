const User = require("../models/User");
const ErrorResponse = require("../utilities/ErrorResponse");

const userController = (io) => {
  const controllerMethods = {};

  io.on("connection", (socket) => {
    socket.on("updateDetails", async ({ id }) => {
      await User.findByIdAndUpdate(id, { socketId: socket.id });
    });
  });

  // @desc      Register user
  // @route     POST /api/v1/auth/signup
  // @access    Public
  controllerMethods.signup = async (req, res, next) => {
    try {
      if (!req.body) {
        return next(new ErrorResponse("Please provide valid details", 406));
      }
      const { name, email, phoneNumber, username, dob, password } = req.body;

      // Checking is user exist
      const user = await User.findOne({ email }).select("+_id");

      if (user) {
        return next(new ErrorResponse("User Already Exist", 401));
      }

      // Create user
      const userCreated = await User.create({
        name,
        email,
        phoneNumber,
        username,
        dob,
        password,
      });

      sendTokenResponse(userCreated, 200, res);
    } catch (e) {
      return next(e);
    }
  };

  // @desc      Login user
  // @route     POST /api/v1/auth/login
  // @access    Public
  controllerMethods.login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      // Validate emil & password
      if (!email || !password) {
        return next(
          new ErrorResponse("Please provide an email and password", 400)
        );
      }

      // Check for user
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorResponse("User not found", 401));
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        return next(new ErrorResponse("Invalid credentials", 401));
      }

      sendTokenResponse(user, 200, res);
    } catch (e) {
      return next(e);
    }
  };

  controllerMethods.updateDetails = async (req, res, next) => {
    try {
      // Validate body
      if (!req.body) {
        return next(new ErrorResponse("Please provide valid details", 400));
      }

      const user = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true,
        select: "-password -__v",
      });

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (e) {
      return next(e);
    }
  };

  controllerMethods.getUsers = async (req, res, next) => {
    try {
      res.status(200).json(res.advancedResults);
    } catch (e) {
      return next(e);
    }
  };

  const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
      success: true,
      token,
    });
  };

  return controllerMethods;
};

module.exports = userController;
