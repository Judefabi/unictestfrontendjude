import React from "react";
import { Upload, Trash } from "lucide-react"; // Icons for upload and delete

const SidebarFooter: React.FC = () => {
  return (
    <div className="flex flex-col space-y-4">
      {/* Part 1: Plan Card */}
      <div className="bg-card text-card-foreground shadow-md rounded-lg  flex flex-col space-y-2">
        {/* Top Section */}
        <div className="text-label-large p-4">
          <p className=" font-semibold">125,000 tokens left</p>
          <p className=" text-muted-foreground">~1,450,000 words</p>
        </div>
        {/* Bottom Section */}
        <div className="w-full bg-[#282828] p-4 text-muted-foreground text-white py-2 rounded cursor-pointer text-label-large ">
          Save My Plan
        </div>
      </div>

      {/* Part 2: Links */}
      <div className="flex flex-col text-label-large">
        {/* Shared Link */}
        <a href="#" className="flex items-center space-x-2 py-5  ">
          <Upload size={20} />
          <span>Shared</span>
        </a>

        {/* Recently Deleted Link */}
        <a
          href="#"
          className="flex items-center space-x-2 py-5  hover:text-red-500">
          <Trash size={20} />
          <span>Recently Deleted</span>
        </a>
      </div>
    </div>
  );
};

export default SidebarFooter;
