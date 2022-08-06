import React from "react";
import { NavigationBar } from "../components/NavigationBar";
import { Sidebar } from "../components/sidebar/Sidebar";

export const RulesScreen = () => {
  return (
    <div className="bg-rich-black w-screen h-screen">
      <Sidebar />
      <NavigationBar />
    </div>
  );
};
