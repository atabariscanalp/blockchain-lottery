import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { MetaMask } from "@web3-react/metamask";
import { hooks as coinbaseHooks } from "../utils/web3/connectors/coinbase";
import { hooks as metamaskHooks } from "../utils/web3/connectors/metamask";
import { useModalContext } from "../utils/context";
import { formatEther } from "ethers/lib/utils";

export const WalletListener: React.FC = ({ children }) => {
  const {
    provider,
    connector,
    chainId,
    ENSName,
    isActive,
    isActivating,
    account,
  } = useWeb3React();

  const { setIsOpen } = useModalContext();

  if (account) {
    provider
      ?.getBalance(account)
      .then((b) => console.log("balance", formatEther(b)));
  }

  useEffect(() => {
    setIsOpen(false);
  }, [isActive, setIsOpen]);

  return <>{children}</>;
};
