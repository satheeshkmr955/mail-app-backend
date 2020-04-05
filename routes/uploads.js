const express = require("express");
const router = express.Router({ mergeParams: true });

const { protect } = require("../middlewares/auth");

const uploadRouter = (io, app) => {
  const uploadController = require("../controllers/Upload");
  const { getFile, getFiles, uploadFiles, deleteFile } = uploadController(
    io,
    app
  );

  router.use(protect);

  router.route("/").get(getFiles).post(uploadFiles);

  router.route("/:fileId").get(getFile).delete(deleteFile);
  return router;
};

module.exports = uploadRouter;
