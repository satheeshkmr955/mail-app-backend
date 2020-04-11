const messageCustomResult = async (req, res, next) => {
  switch (req.query.mailType) {
    case "inbox":
      req.query.receiverId = { in: [req.user.id] };
      req.query.populate = { path: "senderId", select: "name email" };
      break;
    case "sent":
      req.query.senderId = req.user.id;
      req.query.populate = { path: "receiverId", select: "name email" };
    case "draft":
      req.query.senderId = req.user.id;
      req.query.populate = { path: "receiverId", select: "name email" };
    case "outbox":
      req.query.senderId = req.user.id;
      req.query.populate = { path: "receiverId", select: "name email" };
    default:
      req.query.senderId = req.user.id;
      req.query.populate = { path: "receiverId", select: "name email" };
  }
  req.query.deleteId = { nin: [req.user.id] };

  delete req.query["mailType"];
  next();
};

module.exports = messageCustomResult;
