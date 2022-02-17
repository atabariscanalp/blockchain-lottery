import { ethers } from "hardhat";

const LOTTERY_ADDRESS = "0xDF99743cFe90b9ef4940aBB457FFB0CB01d8BBE4";
const TICKET_PRICE = ethers.utils.parseEther("0.005");

const startLottery = async () => {
  const [owner, bob, alice] = await ethers.getSigners();
  const lotteryContract = await ethers.getContractAt(
    "Lottery",
    LOTTERY_ADDRESS,
    owner
  );

  /**
   * start the lottery
   */
  const tx1 = await lotteryContract.startLottery();
  tx1.wait();
  console.log("started the lottery");

  /**
   * enter the lottery
   */
  const tx2 = await lotteryContract.connect(bob).buyTicket({
    from: bob.address,
    value: TICKET_PRICE,
  });
  console.log("waiting for bob..");
  await tx2.wait();
  console.log("bob has joined the lottery");

  const tx3 = await lotteryContract.connect(alice).buyTicket({
    from: alice.address,
    value: TICKET_PRICE,
  });
  console.log("waiting for alice..");
  await tx3.wait();
  console.log("alice has joined the lottery");

  const playerCount = await lotteryContract.getPlayerCount();
  console.log("player count: ", playerCount.toString());

  /**
   * wait for ~3 minutes
   */
  await new Promise((resolve) => setTimeout(resolve, 200000));

  const winner = await lotteryContract.latestWinner();
  console.log("winner: ", winner);
};

startLottery()
  .then()
  .catch((err) => console.error(err));
