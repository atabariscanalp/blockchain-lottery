import { ethers } from "hardhat";
import { getRandomGeneratorAt } from "./utils";

const main = async () => {
  const randomGenerator = await getRandomGeneratorAt(
    "0xdB9C4cDdB066FA21992C1565D18E3C604d6CA765"
  );
  const randomness = await randomGenerator.mostRecentRandomness();
  console.log("randomness: ", randomness.toString());

  const roomId = ethers.utils.formatBytes32String("1");
  const tx1 = await randomGenerator.getRandom(roomId);
  await tx1.wait();
};

main();
