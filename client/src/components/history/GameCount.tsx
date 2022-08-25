import React, { useEffect, useState } from "react";
import { Query, sdk } from "../../api";
import { useWeb3React } from "@web3-react/core";

export const GameCountComponent: React.FC = () => {

  type returnType = Awaited<ReturnType<typeof sdk.User.getGameCount>>
  const { fetch, data, error } = Query<returnType>(sdk.User.getGameCount)

  const { account } = useWeb3React()

  useEffect(() => {
    if (account) {
      fetch({ userId: account })
    }
  }, [account])

  useEffect(() => {
    console.log("error", error)
  }, [error])

  return (
    <div
      className="bg-blue-fade rounded-lg flex flex-col px-4 pt-6 pb-3 items-center justify-between"
      style={{ width: "26%" }}
    >
      <div className="flex flex-col items-center">
        <p className="text-honeydew font-bold text-2xl mb-4">
          GAMES PLAYED
        </p>
        <div className="flex flex-row items-center self-center justify-around">
          <span className="text-honeydew text-2xl font-semibold">{data ? (data.winCount + data.loseCount) : ""}</span>
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
  )
}
