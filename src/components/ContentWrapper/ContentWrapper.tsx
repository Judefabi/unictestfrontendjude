import React from "react";
import Header from "../ChatHeader/ChatHeader";

const ContentWrapper = ({ children }: { children: any }) => {
  return (
    <div>
      {/* Make the Header Full Width */}
      <Header />
      <div className="max-w-7xl mx-auto">
        {/* Apply mx-auto only to the children to center content */}
        {children}
      </div>
    </div>
  );
};

export default ContentWrapper;
