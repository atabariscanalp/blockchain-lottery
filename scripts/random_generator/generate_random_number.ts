import { ethers } from "hardhat";
import { getContractAddresses, getRandomGeneratorAt } from "../utils";

const main = async () => {
  const { randomGeneratorAddress } = getContractAddresses();
  const randomGeneratorContract = await getRandomGeneratorAt(
    randomGeneratorAddress
  );

  let randomness = await randomGeneratorContract.mostRecentRandomness();
  console.log("most recent randomness: ", randomness.toString());

  const bytes32value = ethers.utils.formatBytes32String("1");
  const tx1 = await randomGeneratorContract.getRandom(bytes32value, {
    gasLimit: ethers.BigNumber.from(100000),
  });
  await tx1.wait();

  const getRandomness = async () => {
    randomness = await randomGeneratorContract.mostRecentRandomness();
    console.log("most recent randomness: ", randomness.toString());
  };

  setTimeout(getRandomness, 90000);
};

main().catch((err) => console.error(err));
