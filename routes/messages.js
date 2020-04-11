const express = require("express");
const router = express.Router({ mergeParams: true });

const Message = require("../models/Message");
const messageCustomResult = require("../middlewares/custom/messageCustomResult");
const advancedResults = require("../middlewares/advanceResult");
const { protect } = require("../middlewares/auth");

const messageRouter = (io) => {
  const messageController = require("../controllers/Message");
  const {
    getMessages,
    getMessage,
    createMessage,
    deleteMessage,
    updateMessage,
  } = messageController(io);

  router.use(protect);

  router
    .route("/")
    .get(
      messageCustomResult,
      advancedResults(Message, { path: "attachment" }),
      getMessages
    )
    .post(createMessage);

  router
    .route("/:messageId")
    .get(getMessage)
    .delete(deleteMessage)
    .patch(updateMessage);
  return router;
};

module.exports = messageRouter;
