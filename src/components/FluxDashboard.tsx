import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import axiosInstance from "../http/axios";
import toast from "react-hot-toast";
import { TokenInput } from "./TokenInput";
import { ServerUrlInput } from "./ServerUrlInput";
import { WeightsUpload } from "./WeightsUpload";
import { PromptInput } from "./PromptInput";
import { ImageDisplay } from "./ImageDisplay";

const FluxDashboard = () => {
  // State
  const [token, setToken] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Initial data fetch
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Get saved URL
        const savedUrl = localStorage.getItem("fluxServerURL");
        if (savedUrl) {
          setServerUrl(savedUrl);
          // Set base URL for axios instance
          axiosInstance.defaults.baseURL = savedUrl;
        }
        // Get saved token
        const response = await axiosInstance.get("/get-token");
        if (!response.data.token) {
          toast.error("No token found. Please set one.");
          return;
        }
        console.log(response);
        if (response.data) {
          setToken(response.data.token);
        }
      } catch (error) {
        console.error("Error initializing dashboard:", error);
        toast.error(
          "Error initializing dashboard. Please check your configuration."
        );
      } finally {
        setIsInitialLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  // Handlers
  const handleServerUrlUpdate = (newUrl: string) => {
    setServerUrl(newUrl);
    axiosInstance.defaults.baseURL = newUrl;
  };

  const handleTokenUpdate = (newToken: string) => {
    setToken(newToken);
  };

  const handleGenerate = async (prompt: string) => {
    try {
      const generationParams = {
        prompt,
        height: 1024,
        width: 1024,
        guidance_scale: 3.5,
        num_inference_steps: 50,
        seed: 0,
      };

      const response = await axiosInstance.post("/generate", generationParams, {
        responseType: "blob", // Tell axios to expect streaming binary data
      });

      // Create a URL from the streamed blob data
      const imageUrl = URL.createObjectURL(response.data);
      setGeneratedImageUrl(imageUrl);
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image. Please try again.");
    }
  };

  useEffect(() => {
    // Cleanup the object URL when component unmounts or URL changes
    return () => {
      if (generatedImageUrl && generatedImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(generatedImageUrl);
      }
    };
  }, [generatedImageUrl]);

  // Loading state
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#3a3570]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        {/* Main Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-[#3a3570] text-center sm:text-left">
          Flux Dashboard
        </h1>

        {/* Server URL Input */}
        <ServerUrlInput
          initialUrl={serverUrl}
          onUrlUpdate={handleServerUrlUpdate}
        />

        {/* Token Input */}
        <TokenInput initialToken={token} onTokenUpdate={handleTokenUpdate} />

        {/* Weights Upload */}
        <WeightsUpload />

        {/* Prompt Input */}
        <PromptInput onGenerate={handleGenerate} />

        {/* Image Display */}
        <ImageDisplay imageUrl={generatedImageUrl} />
      </div>
    </div>
  );
};

export default FluxDashboard;
