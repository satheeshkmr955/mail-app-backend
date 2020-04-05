const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    subject: {
      type: String,
      trim: true,
      default: "",
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String, // [DRAFT, SEND]
      trim: true,
      default: "DRAFT",
      uppercase: true,
    },
    attachment: [{ type: mongoose.Schema.ObjectId, ref: "Upload" }],
    delete: {
      type: Boolean,
      required: true,
      default: false,
    },
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
MessageSchema.index({ senderId: 1 });
MessageSchema.index({ receiverId: 1 });

module.exports = mongoose.model("Message", MessageSchema);
