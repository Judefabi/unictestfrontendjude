import React from "react";

const ContentWrapper = ({ children }: { children: any }) => {
  return <div className={`mx-auto`}>{children}</div>;
};

export default ContentWrapper;
