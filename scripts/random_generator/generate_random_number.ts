import { ethers } from "hardhat";
import {
  KOVAN_KEY_HASH,
  KOVAN_LINK,
  KOVAN_VRF_COORDINATOR,
} from "../constants";
import { transferKovanLinkTokenTo } from "../utils";

const main = async () => {
  const RandomGenerator = await ethers.getContractFactory(
    "RandomNumberGenerator"
  );
  const randomGeneratorContract = await RandomGenerator.deploy(
    KOVAN_VRF_COORDINATOR,
    KOVAN_LINK,
    KOVAN_KEY_HASH,
    "0x731fc464496fFf1A9214Cf64ADaBD06c9aaF6570"
  );
  await randomGeneratorContract.deployed();
  console.log("random contract deployed to: ", randomGeneratorContract.address);

  let randomness = await randomGeneratorContract.mostRecentRandomness();
  console.log("most recent randomness: ", randomness.toString());

  await transferKovanLinkTokenTo(randomGeneratorContract.address);

  const tx1 = await randomGeneratorContract.generateRandom();
  await tx1.wait();

  // const bytes32value = ethers.utils.formatBytes32String("1");
  // const tx1 = await randomGeneratorContract.getRandom(bytes32value);
  // await tx1.wait();

  const getRandomness = async () => {
    randomness = await randomGeneratorContract.mostRecentRandomness();
    console.log("most recent randomness: ", randomness.toString());
  };

  setTimeout(getRandomness, 90000);
};

main().catch((err) => console.error(err));
