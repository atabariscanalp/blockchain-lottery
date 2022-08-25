import React from "react";
import { MaticIcon } from "../../../icons/Icons.svg";

type Props = {
  tokenType: string
  value: number
}

export const TokensList: React.FC<Props> = ({ tokenType, value }) => {
  const tokenKeys: Record<string, any> = {
    "MATIC": <MaticIcon width={30} height={30} />,
    "ETH": <MaticIcon width={30} height={30} />,
  }

  return (
    <div className="flex flex-row items-center self-center justify-around">
      {tokenKeys[tokenType]}
      <span className="text-honeydew text-2xl font-semibold">{value}</span>
    </div>
  )
}
