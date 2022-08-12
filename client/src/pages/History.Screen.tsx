import React from "react";
import { MainLayout } from "../components/MainLayout";
import { DuelHistory } from "../components/history/DuelHistory";
import { DownArrowLong, MaticIcon, UpArrowLong } from "../icons/Icons.svg";

export const HistoryScreen = () => {
  return (
    <MainLayout>
      <DuelHistory />
      <div className="w-full mt-6 grow flex justify-between">
        <div
          className="bg-blue-fade rounded-lg flex flex-col px-4 py-6 items-center justify-between"
          style={{ width: "26%" }}
        >
          <div className="flex flex-col items-center">
            <p className="text-honeydew font-bold text-2xl mb-4">
              GAMES PLAYED
            </p>
            <div className="flex flex-row items-center self-center justify-around">
              <span className="text-honeydew text-2xl font-semibold">1223</span>
            </div>
          </div>
          <div className="flex flex-row items-center justify-around self-end justify-self-end w-1/2 px-1">
            <span className="text-grey-fade text-sm font-semibold cursor-pointer">
              TODAY
            </span>
            <span className="font-bold text-rich-black">|</span>
            <span className="text-honeydew text-sm font-bold cursor-pointer">
              ALL TIME
            </span>
          </div>
        </div>
        <div
          className="bg-blue-fade rounded-lg flex flex-col px-4 py-6 items-center"
          style={{ width: "26%" }}
        >
          <div className="flex flex-row items-center mb-5">
            <UpArrowLong width={35} height={40} />
            <span className="text-honeydew text-2xl font-bold">WON</span>
          </div>
          <div className="flex flex-row items-center self-center justify-around">
            <MaticIcon width={60} height={60} />
            <span className="text-honeydew text-2xl font-semibold">1223</span>
          </div>
          <div className="flex flex-row items-center justify-around self-end justify-self-end relative top-10 w-1/2 px-1">
            <span className="text-grey-fade text-sm font-semibold cursor-pointer">
              TODAY
            </span>
            <span className="font-bold text-rich-black">|</span>
            <span className="text-honeydew text-sm font-bold cursor-pointer">
              ALL TIME
            </span>
          </div>
        </div>
        <div
          className="bg-blue-fade rounded-lg flex flex-col px-4 py-6 items-center"
          style={{ width: "26%" }}
        >
          <div className="flex flex-row items-center mb-5">
            <DownArrowLong width={35} height={40} />
            <span className="text-honeydew text-2xl font-bold">LOST</span>
          </div>
          <div className="flex flex-row items-center self-center justify-around">
            <MaticIcon width={60} height={60} />
            <span className="text-honeydew text-2xl font-semibold">723</span>
          </div>
          <div className="flex flex-row items-center justify-around self-end justify-self-end relative top-10 w-1/2 px-1">
            <span className="text-grey-fade text-sm font-semibold cursor-pointer">
              TODAY
            </span>
            <span className="font-bold text-rich-black">|</span>
            <span className="text-honeydew text-sm font-bold cursor-pointer">
              ALL TIME
            </span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
