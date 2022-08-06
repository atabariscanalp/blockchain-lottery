import { ethers } from "hardhat";
import { getDuelAt } from "../utils";

const main = async () => {
  const duel = await getDuelAt("0x09e39C84af0A0916Fe592F968DAf8F4fFD472d93");

  const roomId = ethers.utils.formatBytes32String("1");
  const tx1 = await duel.forceEndDuel(roomId);
  await tx1.wait();

  console.log("ended duel");
};

main().catch((err) => console.error(err));
