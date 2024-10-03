import React from "react";
import { Progress } from "@/components/ui/progress";

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
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div
        className="bg-white rounded-lg p-4 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Website Scraping Progress</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {urls.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm truncate flex-1">{item.url}</p>
                <span
                  className={`text-sm ml-2 ${
                    item.status === "complete"
                      ? "text-green-500"
                      : item.status === "error"
                      ? "text-red-500"
                      : "text-blue-500"
                  }`}>
                  {item.status}
                </span>
              </div>
              <Progress value={item.progress} className="h-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrapingProgressModal;
