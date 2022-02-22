import React from "react";
import { Button } from "./Button";
import { Logo } from "./Logo";

export const NavigationBar = () => {
  return (
    <header className="w-screen py-5 flex justify-between px-4">
      <Logo />
      <Button>Connect Wallet</Button>
    </header>
  );
};
