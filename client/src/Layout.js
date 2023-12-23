import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children, username }) => {
  return (
    <div className="flex h-screen">
      <Sidebar username={username} />
      <div className="w-full p-2 overflow-x-auto">{children}</div>
    </div>
  );
};

export default Layout;
