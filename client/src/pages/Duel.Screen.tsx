import React, { useState } from "react";
import { MainLayout } from "../components/MainLayout";

export const DuelScreen = () => {
  const [index, setIndex] = useState(0);

  return (
    <MainLayout>
      <div className="w-full h-56 flex flex-row items-center">
        <div className="flex flex-col h-full mr-10 grow">
          <div className="w-full flex flex-row items-center mb-4">
            <p
              className={`w-1/2 text-center py-4 font-bold cursor-pointer text-xl ${
                !index ? "text-honeydew" : "text-dark-grey"
              }`}
              onClick={() => setIndex(0)}
            >
              Place Bet
            </p>
            <p
              className={`w-1/2 text-center py-4 font-bold cursor-pointer text-xl ${
                index ? "text-honeydew" : "text-dark-grey"
              }`}
              onClick={() => setIndex(1)}
            >
              Find Games
            </p>
          </div>
          <div className="bg-blue-fade grow flex rounded-lg"></div>
        </div>
        <div className="bg-blue-fade w-62 h-full rounded-lg self-end flex"></div>
      </div>
    </MainLayout>
  );
};
