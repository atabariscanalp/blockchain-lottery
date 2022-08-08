import React from "react";
import { Sidebar } from "./sidebar/Sidebar";
import { NavigationBar } from "./NavigationBar";

export const MainLayout: React.FC = ({ children }) => {
  return (
    <div className="bg-rich-black w-screen h-screen flex fixed">
      <Sidebar />
      <div className="h-full grow px-12 flex flex-col pb-6">
        <NavigationBar />
        {children}
      </div>
    </div>
  );
};
