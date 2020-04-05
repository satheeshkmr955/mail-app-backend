const mongoose = require("mongoose");

const GFSSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model("GFS", GFSSchema, "uploads.files");
