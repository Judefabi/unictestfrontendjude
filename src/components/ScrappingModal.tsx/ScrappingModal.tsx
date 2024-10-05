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
  // console.log("Modal re-render with URLs:", urls); // Log when modal re-renders to test if UI updates okay

  const getStatusColor = (status: ScrapingURL["status"]) => {
    switch (status) {
      case "complete":
        return "text-[#40AE54]";
      case "error":
        return "text-red-500";
      default:
        return "text-[#9B9B9B]";
    }
  };

  const getStatusIcon = (status: ScrapingURL["status"]) => {
    switch (status) {
      case "complete":
        return (
          <div className="w-6 h-6 rounded-full bg-[#40AE5429] flex items-center justify-center">
            <X color="#40AE54" size={12} />
          </div>
        );
      case "error":
        return (
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
            <X size={12} />
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-[#9B9B9B] flex items-center justify-center">
            <X size={12} />
          </div>
        );
    }
  };

  return (
    <div
      className=" flex items-center absolute bottom-40 justify-center p-4 h-fit"
      // onClick={onClose}
    >
      <div
        className="bg-card   text-card-foreground rounded-lg p-4 w-[768px] max-w-full"
        onClick={(e) => e.stopPropagation()}>
        <div className="space-y-4  overflow-y-auto scroll-bar">
          {urls.map((item, index) => (
            <div key={index} className="space-y-2 py-1">
              <div className="flex items-center space-x-2">
                {getStatusIcon(item.status)}
                <p className="text-label-medium truncate flex-1">{item.url}</p>
                <span
                  className={`text-label-medium ${getStatusColor(
                    item.status
                  )}`}>
                  {item.status}
                </span>
              </div>
              <Progress
                value={item.progress}
                className={`h-[3px] ${
                  item.progress == 100
                    ? "[&>*]:bg-[#9B9B9B]"
                    : "[&>*]:bg-[#2AABBC]"
                } `}
              />
            </div>
          ))}
        </div>
        <div className="flex bg-[##2D2D2D] justify-between py-1 mt-2">
          <div className="flex items-center space-x-2 w-fit">
            <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center">
              <X size={12} />
            </div>
            <button
              onClick={onClose}
              className=" text-sm text-gray-400 hover:text-white">
              Cancel All
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Searching {urls.length} of x websites
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrapingProgressModal;
