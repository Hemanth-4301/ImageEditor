import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import ImageVideoProcessor from "./components/ImageVideoProcessor";
import Loader from "./components/Loader";

function App() {
  const [file, setFile] = useState(null);
  const [processedFile, setProcessedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (uploadedFile) => {
    setFile(uploadedFile);
    setIsLoading(true);
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setProcessedFile(URL.createObjectURL(uploadedFile));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-300 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-black shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-4xl font-bold mb-5 text-center text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
            Image & Video Processor
          </h1>
          <p className="px-2 md:px-6 text-[16px] md:text-lg py-4 md:py-8 text-slate-200">
            This tool allows users to upload and process images and videos. Upon
            uploading, the media is automatically converted to black and white,
            and users can adjust the brightness, contrast, and sharpness of the
            processed file in real-time. The sharpness filter enhances the
            clarity of the image or video, while the brightness and contrast
            sliders offer further customization.
          </p>
          <FileUpload onFileUpload={handleFileUpload} />
          {isLoading ? (
            <Loader />
          ) : (
            file &&
            processedFile && (
              <ImageVideoProcessor
                originalFile={file}
                processedFile={processedFile}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
