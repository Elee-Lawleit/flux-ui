import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../http/axios";

interface TokenInputProps {
  initialToken: string;
  onTokenUpdate: (token: string) => void;
}

export const TokenInput = ({
  initialToken,
  onTokenUpdate,
}: TokenInputProps) => {
  const [token, setToken] = useState(initialToken);
  const [isTokenSaving, setIsTokenSaving] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const handleTokenSave = async () => {
    if (!localStorage.getItem("fluxServerURL")) {
      toast.error("Please set a server URL first.");
      return;
    }
    if (!token || token.trim() === "") {
      toast.error("Token cannot be empty.");
      return;
    }

    setIsTokenSaving(true);
    try {
      await axiosInstance.post("/start-app", null, {
        params: { token },
      });
      toast.success("App started successfully.");
      onTokenUpdate(token);
    } catch (error) {
      console.error("Error saving token:", error);
      toast.error("Error saving token. Please try again.");
    } finally {
      setIsTokenSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#0E1F58]">
        Upload Token
      </label>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="flex-1 relative">
          <input
            type={showToken ? "text" : "password"}
            value={token}
            onChange={(e) => setToken(e.currentTarget.value)}
            className="w-full rounded-lg border-2 border-[#3a3570]/20 px-4 py-2 focus:border-[#3a3570] focus:outline-none pr-10"
            placeholder="Enter token"
            style={{ color: token ? "inherit" : "rgba(0, 0, 0, 0.5)" }}
          />
          <button
            type="button"
            onClick={() => setShowToken(!showToken)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showToken ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        <button
          onClick={handleTokenSave}
          disabled={isTokenSaving}
          className="bg-[#3a3570] text-white px-6 py-2 rounded-lg hover:bg-[#3a3570]/90 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTokenSaving ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            "Start App"
          )}
        </button>
      </div>
    </div>
  );
};
