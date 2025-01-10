const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server);

const upload = multer({ dest: "uploads/" }); // Temporary upload directory

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Socket.IO Connection
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Process Image
app.post("/api/image/process", upload.single("image"), async (req, res) => {
  const { brightness, contrast, sharpness } = req.body;

  if (!req.file) return res.status(400).send("No file uploaded");

  const inputPath = req.file.path;
  const outputPath = path.join(
    "processed",
    `${Date.now()}-${req.file.originalname}`
  );

  try {
    await sharp(inputPath)
      .modulate({
        brightness: parseFloat(brightness),
        contrast: parseFloat(contrast),
      })
      .sharpen(parseFloat(sharpness))
      .toFile(outputPath);

    res.json({ imageUrl: `/${outputPath}` });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).send("Image processing failed");
  }
});

// Stream Video
app.post("/api/video/process", upload.single("video"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  const inputPath = req.file.path;
  const outputPath = path.join(
    "processed",
    `${Date.now()}-${req.file.originalname}`
  );

  ffmpeg(inputPath)
    .outputOptions("-vf", "format=gray") // Convert to black and white
    .save(outputPath)
    .on("end", () => {
      io.emit("processedVideo", { videoUrl: `/${outputPath}` });
      res.json({ videoUrl: `/${outputPath}` });
    })
    .on("error", (err) => {
      console.error("Error processing video:", err);
      res.status(500).send("Video processing failed");
    });
});

server.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
