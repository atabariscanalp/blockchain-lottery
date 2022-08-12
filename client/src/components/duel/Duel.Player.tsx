import React from "react";
import { useWeb3React } from "@web3-react/core";
import { LockIcon } from "../../icons/Icons.svg";

export const DuelPlayer = () => {
  const { account } = useWeb3React();

  return (
    <div
      className={`w-62 h-full rounded-lg self-end flex items-center justify-center ${
        account ? "bg-blue-fade" : "bg-black-fade"
      }`}
    >
      {!account ? (
        <div className="flex flex-row w-full items-center justify-center">
          <LockIcon
            width={25}
            height={25}
            fill={"#f1faee"}
            style={{ marginRight: 6 }}
          />
          <span className="text-honeydew text-lg font-regular">
            You need to connect your wallet to play
          </span>
        </div>
      ) : null}
    </div>
  );
};
