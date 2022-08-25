import React, { useEffect, useState } from "react";
import { DummyHistoryData } from "../../dummy-data/History.data";
import { MaticIcon } from "../../icons/Icons.svg";
import { walletAddressParser } from "../../utils/web3/web3.util";
import { Query, sdk } from "../../api";
import { useWeb3React } from "@web3-react/core";
import { Locked } from "../Locked";

export const DuelHistory = () => {
  type returnType = Awaited<ReturnType<typeof sdk.User.getGames>>
  const { fetch, data: gamesData, error } = Query<returnType>(sdk.User.getGames)

  const { fetch: fetchGameCount, data: gameCountData, error: gameCountError } = Query<Awaited<ReturnType<typeof sdk.User.getGameCount>>>(sdk.User.getGameCount)

  const { account } = useWeb3React()

  const [page, setPage] = useState(0)

  const data = gamesData?.slice(page * 4, page * 4 + 4)

  const checkGameResult = (result: number, user1: string) => {
    if (user1 === account) {
      return result === 0 ? "WON" : "LOST"
    }
    return result === 1 ? "WON" : "LOST"
  }

  useEffect(() => {
    if (account) {
      fetchGameCount({ userId: account })
    }
  }, [])

  useEffect(() => {
    if (gameCountData) {
      const gameCount = gameCountData.loseCount + gameCountData.winCount
    }
  }, [gameCountData])

  useEffect(() => {
    if (account) {
      fetch({ userId: account, timestamp: "now" })
    }
  }, [account])

  useEffect(() => {
    console.log("error", error)
  }, [error])

  return (
    <Locked className="bg-blue-fade w-full h-56 rounded-lg py-6 px-9 flex flex-col"
            message="You need to connect your wallet to see the game history">
      <p className="text-honeydew text-2xl font-bold mb-6">Duel History</p>
      <div className="flex flex-row items-center w-full text-honeydew font-semibold text-lg mb-4">
        <div className="w-1/4 flex items-center justify-center">Player1</div>
        <div className="w-1/4 flex items-center justify-center">Player2</div>
        <div className="w-1/4 flex items-center justify-center">Result</div>
        <div className="w-1/4 flex items-center justify-center">Bet Amount</div>
      </div>
      {data && data.map((game) => (
        <div className="flex flex-row w-full items-center mb-4">
          <div className="flex items-center justify-center w-1/4">
            <div className="flex items-center justify-center rounded-lg py-2 px-4 bg-blue-fade-bold text-honeydew">
              {walletAddressParser(game.user1)}
            </div>
          </div>
          <div className="flex items-center justify-center w-1/4">
            <div className="flex items-center justify-center rounded-lg py-2 px-4 bg-blue-fade-bold text-honeydew">
              {walletAddressParser(game.user2)}
            </div>
          </div>
          <div className="flex items-center justify-center w-1/4">
            <div className={`flex items-center justify-center text-honeydew font-bold text-lg rounded-lg px-4 py-2 ${checkGameResult(game.result, game.user1) === "WON" ? "bg-green" : "bg-red"}`}>
              {checkGameResult(game.result, game.user1)}
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
      <span className="self-center text-honeydew font-semibold text-xl mt-4">1 2...96</span>
    </Locked>
  );
};
