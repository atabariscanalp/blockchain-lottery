import React from "react";
import {
  CoinbaseWalletIcon,
  MetamaskIcon,
  WalletConnectIcon,
} from "../icons/Icons.svg";
import {
  coinbaseWallet,
  metaMask,
  walletConnect,
} from "../utils/web3/connectors";

type Wallets = "metamask" | "coinbase" | "walletconnect";
type Props = {
  option: Wallets;
};
const ICON_SIZE = 30;

export const WalletOption: React.FC<Props> = ({ option }) => {
  const connectMetamask = async () => {
    try {
      await metaMask.activate();
    } catch (error: any) {
      console.error(error.code);

      // user rejected connecting wallet
      if (error.code === 4001) {
        console.log("resetting");
        if (metaMask.deactivate) {
          await metaMask.deactivate();
        } else {
          await metaMask.resetState();
        }
        await metaMask.activate();
        console.log("is metamask", metaMask.provider?.isMetaMask);
        // @ts-ignore
        console.log("is connected", metaMask.provider?.isConnected());
        console.log(
          "is metamask",
          metaMask.provider?.on("4001", () => console.log("4001 happened"))
        );
        //metaMask.provider = undefined;
      }
    }
  };
  const connectCoinbase = () => {
    void coinbaseWallet.activate();
  };
  const connectWalletConnect = () => {
    void walletConnect.activate();
  };

  const wallets: Record<Wallets, any> = {
    metamask: {
      icon: <MetamaskIcon width={ICON_SIZE} height={ICON_SIZE} />,
      name: "Metamask",
      onClick: () => connectMetamask(),
    },
    walletconnect: {
      icon: <WalletConnectIcon width={ICON_SIZE} height={ICON_SIZE} />,
      name: "WalletConnect",
      onClick: () => connectWalletConnect(),
    },
    coinbase: {
      icon: <CoinbaseWalletIcon width={ICON_SIZE} height={ICON_SIZE} />,
      name: "Coinbase",
      onClick: () => connectCoinbase(),
    },
  };

  return (
    <div
      className="flex flex-row items-center justify-start pl-6 border rounded-lg
              border-blue-fade-bold py-3 cursor-pointer bg-blue-fade hover:border-blue-light
              mb-2"
      onClick={wallets[option].onClick}
    >
      {wallets[option].icon}
      <span className="ml-5 font-medium text-xl text-rich-black">
        {wallets[option].name}
      </span>
    </div>
  );
};
