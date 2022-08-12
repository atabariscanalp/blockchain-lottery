import React from "react";

type Props = {
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<0 | 1>>;
};

export const DuelHeader: React.FC<Props> = ({ index, setIndex }) => {
  return (
    <div className="w-full flex flex-row items-center mb-4">
      <p
        className={`w-1/2 text-center py-4 font-bold cursor-pointer text-xl ${
          !index ? "text-honeydew" : "text-dark-grey"
        }`}
        onClick={() => setIndex(0)}
      >
        Place Bet
      </p>
      <p
        className={`w-1/2 text-center py-4 font-bold cursor-pointer text-xl ${
          index ? "text-honeydew" : "text-dark-grey"
        }`}
        onClick={() => setIndex(1)}
      >
        Find Games
      </p>
    </div>
  );
};
