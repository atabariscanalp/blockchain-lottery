import React from "react";
import { MaticIcon } from "../../icons/Icons.svg";
import { Button } from "../Button";
import { useWeb3React } from "@web3-react/core";

type Props = {
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
};

export const PlaceBet: React.FC<Props> = ({ amount, setAmount }) => {
  const amountInt = Number(amount || 1);

  const { account } = useWeb3React();

  return (
    <div className="px-9 py-9 flex flex-col w-full h-full">
      <div className="w-full h-full flex flex-col items-center justify-between">
        <div className="flex flex-col items-center w-full">
          <div className="flex flex-row justify-between items-center w-full mb-4">
            <span className="text-honeydew text-lg font-semibold">
              Bet amount
            </span>
            <span className="text-white opacity-20 text-lg font-semibold">
              $25.00
            </span>
          </div>
          <form className="bg-grey-fade rounded-lg flex flex-row items-center py-4 px-4 mb-4 w-full">
            <MaticIcon width={40} height={40} style={{ marginRight: 16 }} />
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              type={"text"}
              style={{ background: "none" }}
              className="h-full w-full outline-none font-medium text-xl text-honeydew"
            />
          </form>
          <div className="w-full flex justify-between">
            <button
              className="w-1/6 bg-grey-fade rounded-lg flex items-center justify-center h-12 font-semibold text-honeydew"
              onClick={() => setAmount((amountInt / 10).toString())}
            >
              1/10
            </button>
            <button
              className="w-1/6 bg-grey-fade rounded-lg flex items-center justify-center h-12 font-semibold text-honeydew"
              onClick={() => setAmount((amountInt / 2).toString())}
            >
              1/2
            </button>
            <button
              className="w-1/6 bg-grey-fade rounded-lg flex items-center justify-center h-12 font-semibold text-honeydew"
              onClick={() => setAmount((amountInt * 2).toString())}
            >
              2x
            </button>
            <button
              className="w-1/6 bg-grey-fade rounded-lg flex items-center justify-center h-12 font-semibold text-honeydew"
              onClick={() => setAmount((amountInt * 5).toString())}
            >
              5x
            </button>
            <button
              className="w-1/6 bg-grey-fade rounded-lg flex items-center justify-center h-12 font-semibold text-honeydew"
              onClick={() => setAmount((amountInt * 10).toString())}
            >
              10x
            </button>
          </div>
        </div>
        <Button
          classNameOverride="w-4/6 self-center"
          disabled={!account}
          onClick={() => alert("clicked")}
        >
          Place Bet
        </Button>
      </div>
    </div>
  );
};
