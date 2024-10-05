import React from "react";
import Header from "../ChatHeader/ChatHeader";

const ContentWrapper = ({ children }: { children: any }) => {
  // this layout defines our content area where we also have anotehr header that is sticky only within this area above the chat area
  return (
    <div>
      {/* Make the Header Full Width */}
      <Header />
      <div className="max-w-7xl mx-auto">
        {/* Apply mx-auto only to the children to center content horizontally  */}
        {children}
      </div>
    </div>
  );
};

export default ContentWrapper;
