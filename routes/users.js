const express = require("express");
const router = express.Router({ mergeParams: true });

const User = require("../models/User");
const userCustomResult = require("../middlewares/custom/userCustomResult");
const advancedResults = require("../middlewares/advanceResult");
const { protect } = require("../middlewares/auth");

const userRouter = (io) => {
  const userController = require("../controllers/User");
  const { signup, login, updateDetails, getUsers } = userController(io);

  router.get(
    "/",
    protect,
    userCustomResult,
    advancedResults(User, null),
    getUsers
  );
  router.post("/signup", signup);
  router.post("/login", login);
  router.patch("/update", protect, updateDetails);
  return router;
};

module.exports = userRouter;
