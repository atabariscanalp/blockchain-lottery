import { useModalContext } from "../../utils/context";
import { Button } from "../Button";
import metamaskIcon from "../../icons/metamask.png";

export const MetamaskProvider = () => {
  const { setIsOpen, setModalType } = useModalContext();
  const onClick = () => {
    setModalType("metamask");
    setIsOpen(true);
  };

  return (
    <Button color="outline" onClick={onClick} size="medium">
      <img src={metamaskIcon} width={14} height={14} alt="metamask" />
    </Button>
  );
};
