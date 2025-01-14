import React, { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../http/axios";
import { AxiosProgressEvent } from "axios";

export const WeightsUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const handleFileSelect = (files: FileList | null) => {
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleFileUpload = async () => {
    if (!localStorage.getItem("fluxServerURL")) {
      toast.error("Please set a server URL first.");
      return;
    }
    if (!selectedFile) {
      toast.error("Please select a valid file to upload.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      await axiosInstance.post("/upload-weights", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          }
        },
      });

      setUploadProgress(100);
      toast.success("File uploaded successfully.");
      setTimeout(() => {
        setUploadProgress(null);
        setSelectedFile(null);
      }, 1000);
    } catch (error) {
      toast.error(
        "An error occurred while uploading the file. Please try again."
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#0E1F58]">
        Upload Weights
      </label>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div
          className={`flex-1 border-2 border-dashed rounded-lg px-6 py-4 bg-white cursor-pointer
            ${
              isDragging
                ? "border-[#3a3570] bg-[#3a3570]/5"
                : "border-[#3a3570]/20"
            }
            hover:border-[#3a3570] hover:bg-[#3a3570]/5 transition-colors`}
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="w-5 h-5 text-[#3a3570]" />
            <span className="text-sm text-gray-600 text-center">
              {selectedFile
                ? `Selected: ${selectedFile.name}`
                : "Choose file/folder or drag and drop"}
            </span>
          </div>
        </div>
        <button
          className="bg-[#3a3570] text-white px-6 py-2 rounded-lg hover:bg-[#3a3570]/90 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleFileUpload}
          disabled={isUploading || !selectedFile}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            "Save"
          )}
        </button>
      </div>
      {uploadProgress !== null && (
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm text-[#3a3570]">
            <span>Uploading file...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 bg-[#3a3570]/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3a3570] transition-all duration-300 ease-out rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
