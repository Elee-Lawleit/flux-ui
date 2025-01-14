import { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface PromptInputProps {
  onGenerate: (prompt: string) => Promise<void>;
}

export const PromptInput = ({ onGenerate }: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!localStorage.getItem("fluxServerURL")) {
      toast.error("Please set a server URL first.");
      return;
    }
    if (!prompt || prompt.trim().length < 1) {
      toast.error("Please enter a valid prompt.");
      return;
    }

    setIsGenerating(true);
    try {
      await onGenerate(prompt);
    } catch (error) {
      toast.error("Error generating image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#0E1F58]">
        Enter Prompt
      </label>
      <div className="flex flex-col gap-2 sm:gap-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 rounded-lg border-2 border-[#3a3570]/20 px-4 py-2 focus:border-[#3a3570] focus:outline-none h-32 resize-none"
          placeholder="Enter your prompt here..."
        />
        <button
          className="bg-[#0E1F58] text-white px-8 py-2 rounded-lg hover:bg-[#0E1F58]/90 transition-colors h-fit w-full sm:w-auto ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            "Generate"
          )}
        </button>
      </div>
    </div>
  );
};
