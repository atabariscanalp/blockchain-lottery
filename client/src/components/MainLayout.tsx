import React from "react";
import { Sidebar } from "./sidebar/Sidebar";
import { NavigationBar } from "./NavigationBar";
import { Modal } from "./Modal";
import { useModalContext } from "../utils/context";

export const MainLayout: React.FC = ({ children }) => {
  const { isOpen } = useModalContext();

  return (
    <div
      className={`bg-rich-black w-screen h-screen flex fixed ${
        isOpen ? "bg-rich-black" : "bg-rich-black"
      }`}
    >
      <Modal />
      <Sidebar />
      <div className="h-full grow px-12 flex flex-col pb-6">
        <NavigationBar />
        {children}
      </div>
    </div>
  );
};
