import { ethers } from "hardhat";
import { getContractAddresses, getRandomGeneratorAt } from "./utils";

const main = async () => {
  const { randomGeneratorAddress } = getContractAddresses();
  const randomGenerator = await getRandomGeneratorAt(randomGeneratorAddress);
  const randomness = await randomGenerator.mostRecentRandomness();
  console.log("randomness: ", randomness.toString());

  const roomId = ethers.utils.formatBytes32String("1");
  const tx1 = await randomGenerator.getRandom(roomId);
  await tx1.wait();
};

main();
