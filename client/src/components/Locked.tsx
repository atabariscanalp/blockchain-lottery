import React from "react";
import { useWeb3React } from "@web3-react/core";
import { LockIcon } from "../icons/Icons.svg";

type Props = React.HTMLProps<HTMLDivElement> & {
  message: string
}

export const Locked: React.FC<Props> = ({children, message, ...rest}) => {
  const { account } = useWeb3React()

  return (
    <div {...rest} className={`${rest.className} ${account ? "bg-blue-fade" : "bg-black-fade"}`}>
      {account ? (
        children
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-row w-full items-center justify-center">
            <LockIcon
              width={25}
              height={25}
              fill={"#f1faee"}
              style={{ marginRight: 6 }}
            />
            <span className="text-honeydew text-lg font-regular">{message}</span>
          </div>
        </div>
      )}
    </div>
  )
}
