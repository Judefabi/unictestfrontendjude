import React from "react";
import { IoIosCopy, IoMdShare } from "react-icons/io";
import { RiDownloadLine } from "react-icons/ri";

const links = [
  {
    id: 1,
    icon: IoIosCopy,
  },
  {
    id: 2,
    icon: RiDownloadLine,
  },
  {
    id: 3,
    icon: IoMdShare,
  },
];

const QuickLinks = () => {
  return (
    <div className="bg-card text-sm text-card-foreground cursor-pointer w-fit flex rounded-xl">
      {links.map((link) => {
        const IconComponent = link.icon;
        return (
          <div key={link.id} className="p-3">
            <IconComponent className="text-label-sm" />
          </div>
        );
      })}
    </div>
  );
};

export default QuickLinks;
