import React from "react";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";

interface ScrapingURL {
  url: string;
  progress: number;
  status: "pending" | "scraping" | "complete" | "error";
}

interface ScrapingProgressModalProps {
  urls: ScrapingURL[];
  onClose: () => void;
}

const ScrapingProgressModal: React.FC<ScrapingProgressModalProps> = ({
  urls,
  onClose,
}) => {
  console.log("Modal re-render with URLs:", urls); // Log when modal re-renders

  const getStatusColor = (status: ScrapingURL["status"]) => {
    switch (status) {
      case "complete":
        return "text-green-500";
      case "error":
        return "text-red-500";
      default:
        return "text-blue-500";
    }
  };

  const getStatusIcon = (status: ScrapingURL["status"]) => {
    switch (status) {
      case "complete":
        return (
          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
            <X size={12} />
          </div>
        );
      case "error":
        return (
          <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
            <X size={12} />
          </div>
        );
      default:
        return (
          <div className="w-4 h-4 rounded-full border-2 border-gray-500 border-t-blue-500 animate-spin"></div>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div
        className="bg-gray-900 text-white rounded-lg p-4 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Website Scraping Progress</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {urls.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center space-x-2">
                {getStatusIcon(item.status)}
                <p className="text-sm truncate flex-1">{item.url}</p>
                <span className={`text-sm ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <Progress value={item.progress} className="h-2" />
            </div>
          ))}
        </div>
        <div className="mt-4 pt-2 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full text-sm text-gray-400 hover:text-white">
            Cancel All
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Searching {urls.length} of 10 websites
        </div>
      </div>
    </div>
  );
};


export default ScrapingProgressModal;
