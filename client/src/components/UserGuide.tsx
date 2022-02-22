import { MetamaskProvider } from "./wallets/Metamask";

export const UserGuide = () => {
  return (
    <div className="py-3 px-3">
      <span className="text-white font-extrabold text-3xl">How it works</span>
      <div>
        <span className="text-white">
          1. You need to connect Polygon(MATIC) Blockchain to your wallet
          provider. (If it is already connected you can skip this step)
          <br />
          <div className="flex flex-row">
            <MetamaskProvider />
          </div>
          2. Now comes the fun part! You specify a minimum and maximum limit
          that you can bet. After that we match you with another player who has
          the same range with you.
          <br />
          3. After you matched you are asked to give the bet amount as the other
          player does.
          <br />
          4. Now you wait! With using Chainlink we get an unpredictable random
          number and determine the winner with that number.
          <br />
          5. If you are the winner, you get %190 of your bet amount back!
        </span>
      </div>
    </div>
  );
};
