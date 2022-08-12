import React, { useState } from "react";
import { MainLayout } from "../components/MainLayout";
import { DuelComponent } from "../components/duel/Duel.Component";
import { DuelHeader } from "../components/duel/Duel.Header";
import { OnlineUserComponent } from "../components/duel/OnlineUser.Component";
import { DuelPlayer } from "../components/duel/Duel.Player";

export const DuelScreen = () => {
  const [index, setIndex] = useState<0 | 1>(0);

  return (
    <MainLayout>
      <div className="w-full h-56 flex flex-row items-center">
        <div className="flex flex-col h-full mr-10 grow">
          <DuelHeader index={index} setIndex={setIndex} />
          <DuelComponent index={index} />
        </div>
        <DuelPlayer />
      </div>
      <OnlineUserComponent />
    </MainLayout>
  );
};
