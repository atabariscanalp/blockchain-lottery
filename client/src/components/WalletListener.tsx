import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { MetaMask } from "@web3-react/metamask";
import { hooks as coinbaseHooks } from "../utils/web3/connectors/coinbase";
import { useModalContext } from "../utils/context";

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

  useEffect(() => {
    setIsOpen(false);
    console.log("new wallet is active", connector);
    console.log("new wallet account", account);
    console.log("new wallet provider", provider);
    console.log("provider", provider);
    console.log(
      "provider instance coinbase",
      connector instanceof CoinbaseWallet
    );
    console.log("provider instance metamask", connector instanceof MetaMask);
    console.log("chain id", chainId);
  }, [isActive, setIsOpen]);

  useEffect(() => {
    console.log("is activating", isActivating);
    console.log("activating connector", connector);
  }, [isActivating]);

  return <>{children}</>;
};
