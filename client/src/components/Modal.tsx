import React, { useRef } from "react";
import { useModalContext } from "../utils/context";
import { WalletOption } from "./WalletOption";

interface ModalProps {}

export const Modal: React.FC<ModalProps> = () => {
  const { isOpen, setIsOpen } = useModalContext();

  const bgRef = useRef<HTMLDivElement | null>(null);

  const closeModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (bgRef.current === e.target) setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center fixed bg-black-fade"
      onClick={closeModal}
      ref={bgRef}
    >
      <div
        style={{ width: 400, height: 500 }}
        className="bg-honeydew rounded-md z-10 shadow-lg px-6 py-4"
      >
        <p className="text-rich-black text-3xl font-semibold mt-6 mb-10">
          Connect a wallet
        </p>
        <WalletOption option="metamask" />
        <WalletOption option="coinbase" />
        <WalletOption option="walletconnect" />
      </div>
    </div>
  );
};
