import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

function FileUpload({ onFileUpload }) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setIsUploading(true);
        onFileUpload(acceptedFiles[0]).finally(() => setIsUploading(false));
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*,video/*",
    disabled: isUploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`mt-4 border-[4px] border-dashed rounded-lg p-6 text-center transition duration-150 ease-in-out ${
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
          drop your file here, or click to select files
        </p>
      )}
    </div>
  );
}

export default FileUpload;
