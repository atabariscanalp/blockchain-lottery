import React, { createContext, useContext, useMemo, useState } from "react";

interface IModal {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalType: "metamask" | "coinbase";
  setModalType: React.Dispatch<React.SetStateAction<"metamask" | "coinbase">>;
}

const ModalContext = createContext<IModal>({
  isOpen: false,
  setIsOpen: () => {},
  modalType: "metamask",
  setModalType: () => {},
});

export const ModalProvider: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<"metamask" | "coinbase">(
    "metamask"
  );
  const value = useMemo(
    () => ({ isOpen, setIsOpen, modalType, setModalType }),
    [isOpen, setIsOpen, modalType, setModalType]
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export const useModalContext = () => useContext(ModalContext);
