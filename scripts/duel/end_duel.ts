import { ethers } from "hardhat";
import { getDuelloAt } from "../utils";

const main = async () => {
  const duel = await getDuelloAt("0xDc179eD0699f7bC465A674095e845a2757be4E56");

  const roomId = ethers.utils.formatBytes32String("1");
  const tx1 = await duel.endDuel(roomId, 3);
  await tx1.wait();

  console.log("ended duello");
};

main().catch((err) => console.error(err));
