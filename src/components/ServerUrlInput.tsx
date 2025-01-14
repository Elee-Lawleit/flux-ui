import { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface ServerUrlInputProps {
  initialUrl: string;
  onUrlUpdate: (url: string) => void;
}

export const ServerUrlInput = ({
  initialUrl,
  onUrlUpdate,
}: ServerUrlInputProps) => {
  const [serverUrl, setServerUrl] = useState(initialUrl);
  const [isServerUrlSaving, setIsServerUrlSaving] = useState(false);

  const handleServerUrlSave = async () => {
    if (serverUrl.trim() === "") {
      toast.error("Server URL cannot be empty.");
      return;
    }

    setIsServerUrlSaving(true);
    try {
      localStorage.setItem("fluxServerURL", serverUrl);
      onUrlUpdate(serverUrl);
      toast.success("Server URL saved successfully.");
    } catch (error) {
      toast.error("Error saving server URL.");
    } finally {
      setIsServerUrlSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#0E1F58]">
        Set Base Server URL
      </label>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <input
          type="text"
          value={serverUrl}
          onChange={(e) => setServerUrl(e.target.value)}
          className="flex-1 rounded-lg border-2 border-[#3a3570]/20 px-4 py-2 focus:border-[#3a3570] focus:outline-none"
          placeholder="Enter server URL"
          style={{ color: serverUrl ? "inherit" : "rgba(0, 0, 0, 0.5)" }}
        />
        <button
          onClick={handleServerUrlSave}
          disabled={isServerUrlSaving}
          className="bg-[#3a3570] text-white px-6 py-2 rounded-lg hover:bg-[#3a3570]/90 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isServerUrlSaving ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            "Save"
          )}
        </button>
      </div>
    </div>
  );
};
