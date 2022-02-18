import { ethers } from "hardhat";
import { getDuelloAt, getRandomGeneratorAt } from "../utils";

const main = async () => {
  const duel = await getDuelloAt("0xfCFe8db9dFB33551F652c51243021C51A3723215");

  const roomId = ethers.utils.formatBytes32String("4");

  const res = await duel.getRoomCount(roomId);
  console.log("count: ", res.toString());
};

main().catch((err) => console.error(err));
