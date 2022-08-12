import React from "react";
import { DummyHistoryData } from "../../dummy-data/History.data";
import { MaticIcon } from "../../icons/Icons.svg";
import { walletAddressParser } from "../../utils/web3/web3.util";

export const DuelHistory = () => {
  const data = DummyHistoryData;

  return (
    <div className="bg-blue-fade w-full h-56 rounded-lg py-6 px-9 flex flex-col">
      <p className="text-honeydew text-2xl font-bold mb-6">Duel History</p>
      <div className="flex flex-row items-center w-full text-honeydew font-semibold text-lg mb-4">
        <div className="w-1/4 flex items-center justify-center">You</div>
        <div className="w-1/4 flex items-center justify-center">Rival</div>
        <div className="w-1/4 flex items-center justify-center">Result</div>
        <div className="w-1/4 flex items-center justify-center">Bet Amount</div>
      </div>
      {data.map((game) => (
        <div className="flex flex-row w-full items-center mb-4">
          <div className="flex items-center justify-center w-1/4">
            <div className="flex items-center justify-center rounded-lg py-2 px-4 bg-blue-fade-bold text-honeydew">
              {walletAddressParser(game.player1)}
            </div>
          </div>
          <div className="flex items-center justify-center w-1/4">
            <div className="flex items-center justify-center rounded-lg py-2 px-4 bg-blue-fade-bold text-honeydew">
              {walletAddressParser(game.player2)}
            </div>
          </div>
          <div className="flex items-center justify-center w-1/4">
            <div className="flex items-center justify-center bg-green text-honeydew font-bold text-lg rounded-lg px-4 py-2">
              {game.result.toUpperCase()}
            </div>
          </div>
          <div className="flex items-center justify-center w-1/4">
            <div className="flex items-center justify-center rounded-lg py-2 px-4 bg-blue-fade-bold text-honeydew font-semibold">
              <MaticIcon width={24} height={24} style={{ marginRight: 6 }} />
              {game.betAmount}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
