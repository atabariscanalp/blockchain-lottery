import React from "react";
import { Button } from "./Button";
import { Logo } from "./Logo";
import { WalletIcon } from "../icons/Icons.svg";
import { useModalContext } from "../utils/context";
import { useWeb3React } from "@web3-react/core";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

export const NavigationBar = () => {
  const { setIsOpen } = useModalContext();
  const { account, connector } = useWeb3React();

  const onClick = () => {
    setIsOpen(true);
  };

  const onDisconnect = () => {
    if (connector.deactivate) {
      connector.deactivate();
    }
  };

  const getButton = () =>
    account ? (
      <Button
        size={"large"}
        color={"outline"}
        icon={
          <Jazzicon
            diameter={20}
            seed={jsNumberForAddress(account)}
            paperStyles={{ marginRight: 12 }}
          />
        }
        classNameOverride={"font-medium"}
        onClick={onDisconnect}
      >
        {account.substring(0, 4) + "..." + account.substring(38)}
      </Button>
    ) : (
      <Button
        size={"large"}
        color={"outline"}
        icon={<WalletIcon width={20} height={20} style={{ marginRight: 12 }} />}
        onClick={onClick}
      >
        Connect Wallet
      </Button>
    );

  // py-6 flex justify-between px-12 absolute top-0 right-0 w-93
  return (
    <header className="py-6 flex justify-between w-full">
      <Logo />
      {getButton()}
    </header>
  );
};
