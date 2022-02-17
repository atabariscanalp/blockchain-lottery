import { ethers } from "hardhat";

const RANDOM_GENERATOR_ADDRESS = "0xEF72638aD4AE3379964F2c5C17FD3545aBD5af29";

const startLottery = async () => {
  const [owner] = await ethers.getSigners();

  const randomGeneratorContract = await ethers.getContractAt(
    "RandomNumberGenerator",
    RANDOM_GENERATOR_ADDRESS,
    owner
  );

  const res = await randomGeneratorContract.mostRecentRandomness();
  console.log("most recent randomness: ", res.toString());
};

startLottery()
  .then()
  .catch((err) => console.error(err));
