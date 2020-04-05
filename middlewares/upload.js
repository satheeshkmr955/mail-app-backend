const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const util = require("util");
const GridFsStorage = require("multer-gridfs-storage");

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const uploadFile = multer({ storage }).array("file", 6);
const uploadFilesMiddleware = util.promisify(uploadFile);
module.exports = uploadFilesMiddleware;
