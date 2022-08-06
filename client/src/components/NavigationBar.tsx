import React from "react";
import { Button } from "./Button";
import { Logo } from "./Logo";
import { WalletIcon } from "../icons/Icons.svg";

export const NavigationBar = () => {
  return (
    <header className="py-6 flex justify-between px-12 absolute top-0 right-0 w-93">
      <Logo />
      <Button
        size={"large"}
        color={"outline"}
        icon={<WalletIcon width={20} height={20} style={{ marginRight: 12 }} />}
      >
        Connect Wallet
      </Button>
    </header>
  );
};
