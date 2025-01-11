import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

function FileUpload({ onFileUpload }) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        setErrorMessage("Only image and video files are allowed.");
        return;
      }

      if (acceptedFiles.length > 0) {
        setErrorMessage(""); 
        setIsUploading(true);
        onFileUpload(acceptedFiles[0]).finally(() => setIsUploading(false));
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
      "video/*": [".mp4", ".mov", ".avi"],
    }, 
    disabled: isUploading,
    onDropRejected: (fileRejections) => {
      setErrorMessage(
        "Only image and video files are allowed. Invalid files were rejected."
      );
    },
  });

  return (
    <div className="mt-4">
      <div
        {...getRootProps()}
        className={`border-[4px] border-dashed rounded-lg p-6 text-center transition duration-150 ease-in-out ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <p className="text-gray-200">Uploading...</p>
        ) : isDragActive ? (
          <p className="text-blue-500">Drop the files here ...</p>
        ) : (
          <p className="text-gray-300">
            Drop your file here, or click to select files
          </p>
        )}
      </div>
      {errorMessage && (
        <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>
      )}
    </div>
  );
}

export default FileUpload;
