import React from "react";
import { Locked } from "../Locked";

export const DuelPlayer = () => {

  return (
    <Locked
      className={`w-62 h-full rounded-lg self-end flex items-center justify-center`}
      message="You need to connect your wallet to play"
    >
    </Locked>
  );
};
