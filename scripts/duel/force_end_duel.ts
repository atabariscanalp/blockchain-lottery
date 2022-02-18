import { ethers } from "hardhat";
import { getDuelloAt } from "../utils";

const main = async () => {
  const duel = await getDuelloAt("0x09e39C84af0A0916Fe592F968DAf8F4fFD472d93");

  const roomId = ethers.utils.formatBytes32String("1");
  const tx1 = await duel.forceEndDuel(roomId);
  await tx1.wait();

  console.log("ended duello");
};

main().catch((err) => console.error(err));
