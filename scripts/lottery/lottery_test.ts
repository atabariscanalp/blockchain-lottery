import { ethers } from "hardhat";

const LOTTERY_ADDRESS = "0xDF99743cFe90b9ef4940aBB457FFB0CB01d8BBE4";

const startLottery = async () => {
  const [owner, bob, alice] = await ethers.getSigners();
  const lotteryContract = await ethers.getContractAt(
    "Lottery",
    LOTTERY_ADDRESS,
    owner
  );

  const winner = await lotteryContract.latestWinner();
  console.log("winner: ", winner);

  const status = await lotteryContract.lotteryState();
  console.log("lottery status: ", status.toString());
};

startLottery()
  .then()
  .catch((err) => console.error(err));
