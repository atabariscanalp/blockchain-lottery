import React from "react";
import { DummyDuelData } from "../../dummy-data/Duel.data";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { walletAddressParser } from "../../utils/web3/web3.util";
import { MaticIcon } from "../../icons/Icons.svg";
import { Button } from "../Button";
import { useWeb3React } from "@web3-react/core";

export const FindGames = () => {
  const data = DummyDuelData;
  const { account } = useWeb3React();

  return (
    <div className="w-full h-full flex flex-col pt-9">
      <div className="w-full flex flex-row items-center">
        <div className="w-1/3 flex items-center justify-center">
          <span className="text-white text-opacity-20 font-semibold text-lg">
            Rival
          </span>
        </div>
        <div className="w-1/3 items-center flex justify-end">
          <span className="text-white text-opacity-20 font-semibold text-lg self-end">
            Bet Amount
          </span>
        </div>
        <div className="w-1/3"></div>
      </div>
      {data.map((duel) => (
        <div className="flex flex-row items-center w-full mt-4 px-3">
          <div className="w-1/3 flex items-center">
            <Jazzicon
              diameter={16}
              seed={jsNumberForAddress(duel.player1WalletAddress)}
              paperStyles={{ marginRight: 10 }}
            />
            <span className="text-honeydew font-semibold text-opacity-70">
              {walletAddressParser(duel.player1WalletAddress)}
            </span>
          </div>
          <div className="w-1/3 flex items-center justify-start pl-10">
            <MaticIcon width={24} height={24} className="mr-2" />
            <span className="text-honeydew text-opacity-70 font-semibold">
              {duel.betAmount}
            </span>
          </div>
          <div className="w-1/3 flex items-center justify-center">
            <Button color={"outline"} size={"small"} disabled={!account}>
              Challenge
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

/*
<div className="w-full h-full flex flex-row pt-9">
  <div className="h-full w-1/3 flex flex-col items-center">
        <span className="text-white text-opacity-20 font-semibold text-lg">
          Rival
        </span>
    {data.map((duel) => (
      <div className="flex-row flex items-center w-full mt-4 pl-4">
        <Jazzicon
          diameter={16}
          seed={jsNumberForAddress(duel.player1WalletAddress)}
          paperStyles={{ marginRight: 10 }}
        />
        <span className="text-honeydew font-semibold text-opacity-70">
              {walletAddressParser(duel.player1WalletAddress)}
            </span>
      </div>
    ))}
  </div>
  <div className="h-full w-1/3 items-center flex flex-col">
        <span className="text-white text-opacity-20 font-semibold text-lg self-end">
          Bet Amount
        </span>
    {data.map((duel) => (
      <div className="flex flex-row items-center w-1/2 justify-start mt-4 self-end">
        <MaticIcon width={24} height={24} className="mr-2" />
        <span className="text-honeydew text-opacity-70 font-semibold">
              {duel.betAmount}
            </span>
      </div>
    ))}
  </div>
  <div className="h-full w-1/3 items-center flex flex-col pt-8">
    {Array(data.length)
      .fill(0)
      .map((i) => (
        <Button color={"outline"} size={"small"} classNameOverride="mt-4">
          Challenge
        </Button>
      ))}
  </div>
</div>*/
