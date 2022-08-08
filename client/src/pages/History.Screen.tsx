import React from "react";
import { MainLayout } from "../components/MainLayout";

export const HistoryScreen = () => {
  return (
    <MainLayout>
      <div className="bg-blue-fade w-full h-56 rounded-lg"></div>
      <div className="w-full mt-6 grow flex justify-between">
        <div className="bg-blue-fade rounded-lg" style={{ width: "26%" }}></div>
        <div className="bg-blue-fade rounded-lg" style={{ width: "26%" }}></div>
        <div className="bg-blue-fade rounded-lg" style={{ width: "26%" }}></div>
      </div>
    </MainLayout>
  );
};
