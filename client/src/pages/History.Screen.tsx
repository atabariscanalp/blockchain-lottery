import React from "react";
import { MainLayout } from "../components/MainLayout";
import { DuelHistory } from "../components/history/DuelHistory";
import { DownArrowLong, MaticIcon, UpArrowLong } from "../icons/Icons.svg";
import { useWeb3React } from "@web3-react/core";
import { GameCountComponent } from "../components/history/GameCount";
import { TokensWonComponent } from "../components/history/TokensWon";
import { TokensLostComponent } from "../components/history/TokensLost";

export const HistoryScreen = () => {

  const { account } = useWeb3React()

  return (
    <MainLayout>
      <DuelHistory />
      <div className="w-full mt-6 grow flex justify-between">
        <GameCountComponent />
        <TokensWonComponent />
        <TokensLostComponent />
      </div>
    </MainLayout>
  );
};
