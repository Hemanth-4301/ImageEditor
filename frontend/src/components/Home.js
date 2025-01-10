import React, { useState, useRef, useEffect } from "react";
import { saveAs } from "file-saver";
import "../App.css";

const Home = () => {
  const [file, setFile] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    sharpness: 100,
  });
  const [loading, setLoading] = useState(false); // Loading state
  const originalRef = useRef(null);
  const processedRef = useRef(null);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const isVideoFile = uploadedFile.type.startsWith("video");
      setIsVideo(isVideoFile);
      setFile(URL.createObjectURL(uploadedFile));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const uploadedFile = e.dataTransfer.files[0];
    if (uploadedFile) {
      setFile(URL.createObjectURL(uploadedFile));
    } else {
      console.error("No file found in the drop event.");
    }
  };

  const applyFilters = () => {
    const processedElement = processedRef.current;
    if (!processedElement) return;

    const filterString = `brightness(${filters.brightness}%) contrast(${
      filters.contrast
    }%) grayscale(100%) blur(${(100 - filters.sharpness) / 10}px)`;
    processedElement.style.filter = filterString;
  };

  useEffect(() => {
    applyFilters();
  }, [filters, file]);

  const handleDownload = () => {
    const processedCanvas = document.createElement("canvas");
    const context = processedCanvas.getContext("2d");
    const processedElement = processedRef.current;

    if (!processedElement) return;

    if (isVideo) {
      // Set canvas size to the video
      processedCanvas.width = processedElement.videoWidth;
      processedCanvas.height = processedElement.videoHeight;

      // Draw the processed video frame onto the canvas
      context.drawImage(
        processedElement,
        0,
        0,
        processedElement.videoWidth,
        processedElement.videoHeight
      );

      // Apply the same filter to the canvas
      const filterString = `brightness(${filters.brightness}%) contrast(${
        filters.contrast
      }%) grayscale(100%) blur(${(100 - filters.sharpness) / 10}px)`;
      context.filter = filterString;

      // Re-draw with filters applied
      context.drawImage(
        processedElement,
        0,
        0,
        processedElement.videoWidth,
        processedElement.videoHeight
      );

      // Save as an image (video frame)
      processedCanvas.toBlob((blob) => {
        saveAs(blob, "processed-video-frame.png");
      });
    } else {
      // For images, apply filters directly to the canvas
      const img = processedElement;
      processedCanvas.width = img.naturalWidth;
      processedCanvas.height = img.naturalHeight;

      // Apply the same filter to the canvas
      const filterString = `brightness(${filters.brightness}%) contrast(${
        filters.contrast
      }%) grayscale(100%) blur(${(100 - filters.sharpness) / 10}px)`;
      context.filter = filterString;

      // Draw the processed image onto the canvas with filters applied
      context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

      // Save as image
      processedCanvas.toBlob((blob) => {
        saveAs(blob, "processed-image.png");
      });
    }
  };

  return (
    <div className="h-[100vp]">
      <div className="min-h-screen bg-black text-white flex flex-col items-center p-5 py-16">
        <h1 className="text-3xl font-bold mb-5 text-white">
          Image & Video Processor
        </h1>
        <p className="px-2 md:px-6 text-[16px] md:text-lg py-4 md:py-8">
          This tool allows users to upload and process images and videos. Upon
          uploading, the media is automatically converted to black and white,
          and users can adjust the brightness, contrast, and sharpness of the
          processed file in real-time. The sharpness filter enhances the clarity
          of the image or video, while the brightness and contrast sliders offer
          further customization.
        </p>
        <div
          className="w-full max-w-lg p-5 border-dashed border-2 border-white rounded-lg text-center bg-slate-950"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <p className="text-white mb-3">Drag & Drop your file here or</p>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="block w-full text-white border rounded-lg cursor-pointer "
          />
        </div>

        {/* Processing Section */}
        {file && (
          <div className="mt-10 w-full max-w-3xl">
            <div className="flex flex-col lg:flex-row lg:space-x-5">
              <div className="flex-1 mb-5 lg:mb-0">
                <p className="text-center text-white mb-3">Original</p>
                {isVideo ? (
                  <video
                    ref={originalRef}
                    src={file}
                    controls
                    className="rounded-lg shadow-lg w-full"
                  ></video>
                ) : (
                  <img
                    ref={originalRef}
                    src={file}
                    alt="Original"
                    className="rounded-lg shadow-lg w-full"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="text-center text-white mb-3">Processed</p>
                {isVideo ? (
                  <video
                    ref={processedRef}
                    src={file}
                    controls
                    className="rounded-lg shadow-lg w-full"
                  ></video>
                ) : (
                  <img
                    ref={processedRef}
                    src={file}
                    alt="Processed"
                    className="rounded-lg shadow-lg w-full"
                  />
                )}
              </div>
            </div>

            {/* Comparison Slider */}
          </div>
        )}

        {/* Controls Section */}
        {file && (
          <div className="mt-5 w-full max-w-lg bg-black p-5 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-3">
              Adjust Filters
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-1">Brightness</label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={filters.brightness}
                  onChange={(e) =>
                    setFilters({ ...filters, brightness: e.target.value })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-white mb-1">Contrast</label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={filters.contrast}
                  onChange={(e) =>
                    setFilters({ ...filters, contrast: e.target.value })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-white mb-1">Sharpness</label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={filters.sharpness}
                  onChange={(e) =>
                    setFilters({ ...filters, sharpness: e.target.value })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {file && (
          <button
            onClick={handleDownload}
            className="mt-5 bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-300"
          >
            {loading ? "Processing..." : "Download Processed File"}
          </button>
        )}

        {/* Loader (spinner) */}
        {loading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="loader">Loading...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
