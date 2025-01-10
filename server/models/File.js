const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  mimetype: String,
  size: Number,
  processedPath: String, // Path to the processed file
});

const File = mongoose.model("File", fileSchema);

module.exports = File;
