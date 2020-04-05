const ErrorResponse = require("../utilities/ErrorResponse");
const Upload = require("../models/Upload");
const uploadFiles = require("../middlewares/upload");
const uploadController = (io, app) => {
  const controllerMethods = {};

  // @desc      Get Files
  // @route     GET /api/v1/upload
  // @access    Private
  controllerMethods.getFiles = async (req, res, next) => {
    try {
    } catch (e) {
      return next(e);
    }
  };

  // @desc      Get File
  // @route     GET /api/v1/upload/:fileId
  // @access    Private
  controllerMethods.getFile = async (req, res, next) => {
    try {
      const gfs = app.get("gfs");
      if (!gfs) {
        return next(new ErrorResponse(`Cannot get files`, 500));
      }
      if (!req.params.fileId) {
        return next(
          new ErrorResponse(
            `Please enter valid attachment id ${req.params.fileId}`,
            400
          )
        );
      }
      const upload = await Upload.findById(req.params.fileId);
      if (!upload) {
        return next(
          new ErrorResponse(
            `No attachment with the id of ${req.params.fileId}`,
            404
          )
        );
      }
      await gfs.find({ _id: upload.fileId }).toArray((err, files) => {
        if (!files || files.length === 0) {
          return res.status(404).json({
            status: false,
            data: "File Not Exist",
          });
        }
        gfs.openDownloadStreamByName(files[0].filename).pipe(res);
      });
    } catch (e) {
      return next(e);
    }
  };

  // @desc      Add File
  // @route     POST /api/v1/upload
  // @access    Private
  controllerMethods.uploadFiles = async (req, res, next) => {
    try {
      await uploadFiles(req, res);
      const fileId = req.files.map((obj) => obj.id);
      const uploads = await Upload.create({
        fileId,
        ownerId: req.user.id,
        filesDetails: req.files[0],
      });
      res.send({ success: true, data: uploads });
    } catch (e) {
      return next(e);
    }
  };

  // @desc      Delete File
  // @route     DELETE /api/v1/upload/:fileId
  // @access    Private
  controllerMethods.deleteFile = async (req, res, next) => {
    try {
    } catch (e) {
      return next(e);
    }
  };

  return controllerMethods;
};

module.exports = uploadController;
