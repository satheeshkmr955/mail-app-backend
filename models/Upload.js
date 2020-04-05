const mongoose = require("mongoose");

const UploadSchema = new mongoose.Schema(
  {
    fileId: { type: mongoose.Schema.ObjectId, ref: "GFS" },
    ownerId: { type: mongoose.Schema.ObjectId, ref: "User" },
    filesDetails: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Indexing the fields to queries faster
UploadSchema.index({ fileId: 1 });

module.exports = mongoose.model("Upload", UploadSchema);
