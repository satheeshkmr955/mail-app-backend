const ErrorResponse = require("../utilities/ErrorResponse");
const Message = require("../models/Message");
const User = require("../models/User");

const messageController = (io) => {
  const controllerMethods = {};
  // @desc      Get Messages
  // @route     GET /api/v1/message
  // @access    Private
  controllerMethods.getMessages = async (req, res, next) => {
    try {
      res.status(200).json(res.advancedResults);
    } catch (e) {
      return next(e);
    }
  };

  // @desc      Get Message
  // @route     GET /api/v1/message/:messageId
  // @access    Private
  controllerMethods.getMessage = async (req, res, next) => {
    try {
      if (!req.params.messageId) {
        return next(
          new ErrorResponse(
            `Please enter valid message id ${req.params.messageId}`,
            400
          )
        );
      }

      const message = await Message.findById(req.params.messageId).populate({
        path: "attachment",
      });

      if (!message) {
        return next(
          new ErrorResponse(
            `No message with the id of ${req.params.messageId}`,
            404
          )
        );
      }

      res.status(200).json({
        success: true,
        data: message,
      });
    } catch (e) {
      return next(e);
    }
  };

  // @desc      Add Message
  // @route     POST /api/v1/message
  // @access    Private
  controllerMethods.createMessage = async (req, res, next) => {
    try {
      // Validate body
      if (!req.body) {
        return next(new ErrorResponse("Please provide valid details", 400));
      }

      const { receiverId, status } = req.body;

      if (receiverId && receiverId.length > 0 && status !== "draft") {
        const userList = await User.find({ _id: { $in: receiverId } });
        userList.map((obj) => {
          io.to(`${obj.socketId}`).emit("inbox", {
            name: req.user.name,
            subject: req.body.subject,
          });
        });
      }

      req.body.senderId = req.user.id;

      const message = await Message.create(req.body);

      res.status(201).json({
        success: true,
        data: message,
      });
    } catch (e) {
      return next(e);
    }
  };

  // @desc      Update Message
  // @route     PATCH /api/v1/message/:messageId
  // @access    Private
  controllerMethods.updateMessage = async (req, res, next) => {
    try {
      const messageId = req.params.messageId || null;

      // Validate messageId
      if (!messageId) {
        return next(
          new ErrorResponse(`Please enter valid message id ${messageId}`, 400)
        );
      }

      // Validate body
      if (!req.body) {
        return next(new ErrorResponse("Please provide valid details", 400));
      }

      const { receiverId, status } = req.body;

      req.body.senderId = req.user.id;

      const message = await Message.findByIdAndUpdate(messageId, req.body, {
        new: true,
        runValidators: true,
      });

      if (!message) {
        return next(
          new ErrorResponse(
            `Can't update message with the id of ${messageId}`,
            404
          )
        );
      }

      if (receiverId && receiverId.length > 0 && status !== "draft") {
        const userList = await User.find({ _id: { $in: receiverId } });
        userList.map((obj) => {
          io.to(`${obj.socketId}`).emit("inbox", {
            name: req.user.name,
            subject: req.body.subject,
          });
        });
      }

      res.status(200).json({
        success: true,
        data: message,
      });
    } catch (e) {
      return next(e);
    }
  };

  // @desc      Delete Message
  // @route     DELETE /api/v1/message/:messageId
  // @access    Private
  controllerMethods.deleteMessage = async (req, res, next) => {
    try {
      const messageId = req.params.messageId || null;

      if (!messageId) {
        return next(
          new ErrorResponse(`Please enter valid message id ${messageId}`, 400)
        );
      }

      const message = await Message.findByIdAndUpdate(messageId, {
        $addToSet: { deleteId: req.user._id },
      });

      if (!message) {
        return next(
          new ErrorResponse(`No message with the id of ${messageId}`, 404)
        );
      }

      res.status(200).json({
        success: true,
        data: "Delete Successfully",
      });
    } catch (e) {
      return next(e);
    }
  };
  return controllerMethods;
};

module.exports = messageController;
