import { ethers } from "hardhat";
import { getDuelloAt } from "../utils";

const DUEL_ADDRESS = "0xDc179eD0699f7bC465A674095e845a2757be4E56";

const main = async () => {
  /**
   * get already deployed contracts
   */
  const duel = await getDuelloAt(DUEL_ADDRESS);

  /**
   * get signers
   */
  const [_, bob, alice] = await ethers.getSigners();

  const roomId = ethers.utils.formatBytes32String("1");
  const betAmount = ethers.utils.parseEther("0.0001");

  /**
   * make bob enter duel
   */
  console.log("bob entering the duel...");
  const tx1 = await duel.connect(bob).enterDuel(roomId, {
    from: bob.address,
    value: betAmount,
  });
  await tx1.wait();
  console.log("bob entered the duel!");

  /**
   * make alice enter duel
   */
  console.log("alice entering the duel...");
  const tx2 = await duel.connect(alice).enterDuel(roomId, {
    from: alice.address,
    value: betAmount,
  });
  await tx2.wait();
  console.log("alice entered the duel!");

  /**
   * start the duel
   */
  const tx3 = await duel.startDuel(roomId);
  await tx3.wait();
  console.log("started the duel!");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
