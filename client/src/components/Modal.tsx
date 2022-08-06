import React, { useRef } from "react";
import { useModalContext } from "../utils/context";

interface ModalProps {}

export const Modal: React.FC<ModalProps> = () => {
  const { isOpen, setIsOpen, modalType } = useModalContext();

  const bgRef = useRef<HTMLDivElement | null>(null);

  const closeModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (bgRef.current === e.target) setIsOpen(false);
  };

  const setInnerModal = () => {
    if (modalType === "metamask") {
      return <span>metamask</span>;
    }
    return <span>coinbase</span>;
  };

  return (
    <>
      {isOpen && (
        <div
          className="w-full h-full flex items-center justify-center fixed bg-black bg-opacity-20"
          onClick={closeModal}
          ref={bgRef}
        >
          <div
            style={{ width: 800, height: 500 }}
            className="bg-white rounded-md z-10 shadow-lg"
          >
            {setInnerModal()}
          </div>
        </div>
      )}
    </>
  );
};
