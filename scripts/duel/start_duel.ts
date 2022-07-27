import { ethers } from "hardhat";
import { getContractAddresses, getDuelAt } from "../utils";

const main = async () => {
  const { duelAddress } = getContractAddresses();
  /**
   * get already deployed contracts
   */
  const duel = await getDuelAt(duelAddress);

  /**
   * get signers
   */
  // eslint-disable-next-line no-unused-vars
  const [_, bob, alice] = await ethers.getSigners();

  console.log("bob address", bob.address);
  console.log("alice address", alice.address);

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
   * room is full, so start the duel
   */
  console.log("alice entering the duel...");
  const tx2 = await duel.connect(alice).enterDuel(roomId, {
    from: alice.address,
    value: betAmount,
  });
  await tx2.wait();
  console.log("alice entered the duel!");
  console.log("duel probably started...");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
