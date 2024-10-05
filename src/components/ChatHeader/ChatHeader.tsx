import React, { useState } from "react";
import { Edit3, Copy, Download, Share } from "lucide-react"; // Icons for writing, copy, download, and share

const Header: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<
    "stream" | "parallel" | "sequential"
  >("stream");

  return (
    <header className="fixed top-[60px] w-full lg:max-w-[1254px] xl:max-w-[1600px]  px-5 z-50 flex items-center justify-between bg-background text-foreground p-4 border-b border-t border-card ">
      {/* Part 1: Task Label with Writing Icon */}
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-lg">Front-end Task</span>
        <Edit3 className="mr-2" size={20} />
      </div>

      {/* Part 2: Tabs (Stream, Parallel, Sequential) */}
      <nav className="flex bg-card rounded font-semibold">
        <button
          onClick={() => setSelectedTab("stream")}
          className={`px-4 py-2 rounded ${
            selectedTab === "stream"
              ? "bg-card-foreground text-background"
              : "bg-card text-card-foreground"
          }`}>
          Stream
        </button>
        <button
          onClick={() => setSelectedTab("parallel")}
          className={`px-4 py-2 rounded ${
            selectedTab === "parallel"
              ? "bg-card-foreground text-background"
              : "bg-card text-card-foreground"
          }`}>
          Parallel
        </button>
        <button
          onClick={() => setSelectedTab("sequential")}
          className={`px-4 py-2 rounded ${
            selectedTab === "sequential"
              ? "bg-card-foreground text-background"
              : "bg-card text-card-foreground"
          }`}>
          Sequential
        </button>
      </nav>

      {/* Part 3: ChatGPT 4.0 Section and Action Buttons */}
      <div className="flex items-center space-x-4">
        <span className="font-semibold bg-card text-label-large p-2 rounded">
          ChatGPT 4.0
        </span>
        <div className="flex space-x-2 text-label-small text-card-foreground">
          <button className="flex items-center space-x-1 bg-card p-3 rounded hover:bg-gray-600">
            <Copy size={12} />
          </button>
          <button className="flex items-center space-x-1 bg-card p-3 rounded hover:bg-gray-600">
            <Download size={12} />
          </button>
          <button className="flex items-center space-x-1 bg-card p-3 rounded hover:bg-gray-600">
            <Share size={12} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
