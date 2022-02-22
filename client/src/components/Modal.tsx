import React, { useRef } from "react";

interface ModalProps {}

export const Modal: React.FC<ModalProps> = ({ children }) => {
  const { isOpen, setIsOpen } = useModalContext();

  const bgRef = useRef<HTMLDivElement | null>(null);

  const closeModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (bgRef.current === e.target) setIsOpen(false);
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
            {children}
          </div>
        </div>
      )}
    </>
  );
};
