import React, { useState, useRef, useEffect } from "react";

function ImageVideoProcessor({ originalFile, processedFile }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isVideo, setIsVideo] = useState(false);
  const [controls, setControls] = useState({
    sharpness: 0,
    brightness: 100,
    contrast: 100,
  });

  const containerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    setIsVideo(originalFile.type.startsWith("video/"));
  }, [originalFile]);

  const handleSliderChange = (e) => {
    setSliderPosition(e.target.value);
  };

  const handleControlChange = (control, value) => {
    setControls((prev) => ({ ...prev, [control]: parseInt(value) }));
  };

  const getFilterString = () => {
    return `grayscale(100%) brightness(${controls.brightness}%) contrast(${
      controls.contrast
    }%) saturate(${100 + controls.sharpness}%)`;
  };

  const applyFilterToImage = (image) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.filter = getFilterString();
      ctx.drawImage(image, 0, 0, image.width, image.height);
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const handleDownload = async () => {
    let downloadUrl;
    let fileName;

    if (isVideo) {
      downloadUrl = processedFile;
      fileName = `processed_${originalFile.name}`;
    } else {
      const image = new Image();
      image.src = processedFile;
      await new Promise((resolve) => {
        image.onload = resolve;
      });
      const processedBlob = await applyFilterToImage(image);
      downloadUrl = URL.createObjectURL(processedBlob);
      fileName = `processed_${originalFile.name.replace(/\.[^/.]+$/, "")}.jpg`;
    }

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (!isVideo) {
      URL.revokeObjectURL(downloadUrl);
    }
  };

  return (
    <div className="mt-8" ref={containerRef}>
      <div className="relative overflow-hidden rounded-lg shadow-lg">
        <div className="relative">
          {isVideo ? (
            <video ref={videoRef} controls className="w-full">
              <source
                src={URL.createObjectURL(originalFile)}
                type={originalFile.type}
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={URL.createObjectURL(originalFile)}
              alt="Original"
              className="w-full"
            />
          )}
          <div
            className="absolute top-0 left-0 h-full overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            {isVideo ? (
              <video
                ref={videoRef}
                controls
                className="w-full h-full object-cover"
                style={{ filter: getFilterString() }}
              >
                <source src={processedFile} type={originalFile.type} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={processedFile}
                alt="Processed"
                className="w-full h-full object-cover"
                style={{ filter: getFilterString() }}
              />
            )}
          </div>
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md"
            style={{ left: `${sliderPosition}%` }}
          ></div>
          <div
            className="absolute top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer transition duration-150 ease-in-out hover:bg-gray-100"
            style={{ left: `${sliderPosition}%`, marginLeft: "-16px" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              />
            </svg>
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handleSliderChange}
          className="absolute top-0 bottom-0 left-0 w-full opacity-0 cursor-ew-resize"
        />
      </div>
      <div className="mt-6 space-y-4">
        {["brightness", "contrast", "sharpness"].map((control) => (
          <div key={control} className="space-y-2">
            <label className="block text-sm font-medium text-gray-100 capitalize">
              {control}
            </label>
            <input
              type="range"
              min={control === "sharpness" ? -100 : 0}
              max={control === "sharpness" ? 100 : 200}
              value={controls[control]}
              onChange={(e) => handleControlChange(control, e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-200">
              {control === "sharpness"
                ? controls[control]
                : `${controls[control]}%`}
            </span>
          </div>
        ))}
      </div>
      <button
        onClick={handleDownload}
        className="mt-6 w-full bg-gradient-to-r from-teal-400 to-blue-500 text-white py-2 px-4 rounded-md hover:from-teal-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out transform hover:scale-105"
      >
        Download Processed File
      </button>
    </div>
  );
}

export default ImageVideoProcessor;
