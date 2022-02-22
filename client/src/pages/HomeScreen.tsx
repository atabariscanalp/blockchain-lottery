import React from "react";
import { NavigationBar } from "../components/NavigationBar";
import { UserGuide } from "../components/UserGuide";

export const HomeScreen = () => {
  return (
    <div className="bg-slate-700 w-screen h-screen">
      <NavigationBar />
      <UserGuide />
    </div>
  );
};
