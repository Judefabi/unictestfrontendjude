import React from "react";

const ContentWrapper = ({ children }: { children: any }) => {
  return (
    <div
      className={`
      flex-grow overflow-auto scroll-bar mt-[34px]
      transition-all duration-300 xl:max-w-[1212px] ml-[16px]
    `}>
      {children}
    </div>
  );
};

export default ContentWrapper;
