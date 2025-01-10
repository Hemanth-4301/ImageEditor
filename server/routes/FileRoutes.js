const express = require("express");
const multer = require("multer");
const path = require("path");
const File = require("../models/File");
const { processImageOrVideo, processVideo } = require("../utils/processUtils");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Route to upload and process files
router.post("/process", upload.single("file"), async (req, res) => {
  try {
    const { file } = req;
    const { sharpness, brightness, contrast } = req.body;

    // Create a new file entry in the database
    const newFile = new File({
      filename: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
    });
    await newFile.save();

    let processedPath;
    if (file.mimetype.startsWith("image/")) {
      processedPath = await processImageOrVideo(
        file.path,
        sharpness,
        brightness,
        contrast
      );
    } else if (file.mimetype.startsWith("video/")) {
      processedPath = await processVideo(file.path);
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // Update the processed path in the database
    newFile.processedPath = processedPath;
    await newFile.save();

    // Send the relative URL of the processed file
    res.status(200).json({
      message: "File processed successfully",
      originalPath: file.path,
      processedPath: `/uploads/${path.basename(processedPath)}`, // Return relative path
    });
    console.log(processedPath);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error processing file", error: err.message });
  }
});

module.exports = router;
