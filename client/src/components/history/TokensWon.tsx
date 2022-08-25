import React, { useEffect, useState } from "react";
import { Query, sdk } from "../../api";
import { MaticIcon, UpArrowLong } from "../../icons/Icons.svg";
import { TokensList } from "./tokens/TokensList";
import { useWeb3React } from "@web3-react/core";

export const TokensWonComponent: React.FC = () => {

  type returnType = Awaited<ReturnType<typeof sdk.User.getWonTokens>>
  const { fetch, data, error } = Query<returnType>(sdk.User.getWonTokens)

  const { account } = useWeb3React()

  useEffect(() => {
    if (account) {
      fetch({ userId: account })
    }
  }, [account])

  if (data) {
    console.log("dataa", data)
  }

  useEffect(() => {
    console.log("error", error)
  }, [error])

  return (
    <div
      className="bg-blue-fade rounded-lg flex flex-col px-4 pt-6 pb-3 items-center justify-between"
      style={{ width: "26%" }}
    >
      <div className="flex flex-col items-center">
        <div className="flex flex-row items-center mb-5">
          <UpArrowLong width={35} height={40} />
          <span className="text-honeydew text-2xl font-bold">WON</span>
        </div>
        {data ?
          (
            <div className="flex flex-col items-center self-center justify-around">
              {Object.keys(data).map((k, v) => (
                <TokensList tokenType={k} value={data[k]} />
              ))}
            </div>
          ) : null
        }
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
