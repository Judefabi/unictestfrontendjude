import React from "react";

const ReactMarkdown = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default ReactMarkdown;

// With this mock file, I am able to avoid errors from node modules not being able to load packages like react-markdown and react-syntax-highlighter during testing