import clsx from "clsx";
import { Download } from "lucide-react";
import toast from "react-hot-toast";

interface ImageDisplayProps {
  imageUrl?: string;
}

export const ImageDisplay = ({ imageUrl }: ImageDisplayProps) => {
  const handleDownload = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "generated-image.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Error downloading image. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={clsx(
          "w-full bg-white rounded-lg border-2 border-[#3a3570]/20 flex items-center justify-center",
          !imageUrl && "aspect-video"
        )}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Generated"
            className="max-w-full max-h-full"
          />
        ) : (
          <span className="text-gray-400">
            Generated image will appear here
          </span>
        )}
      </div>
      {imageUrl && (
        <button
          onClick={handleDownload}
          className="bg-[#3a3570] text-white px-6 py-2 rounded-lg hover:bg-[#3a3570]/90 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ml-auto"
        >
          <Download className="w-4 h-4" />
          Download Image
        </button>
      )}
    </div>
  );
};
