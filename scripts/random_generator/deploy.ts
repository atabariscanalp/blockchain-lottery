import { ethers } from "hardhat";
import { keyHashes, linkTokenAddresses, vrfCoordinators } from "../constants";
import { getContractAddresses } from "../utils";

const network = "MUMBAI";

const main = async () => {
  const { governanceAddress } = getContractAddresses();

  const RandomGenerator = await ethers.getContractFactory(
    "RandomNumberGenerator"
  );
  const randomGenerator = await RandomGenerator.deploy(
    vrfCoordinators[network],
    linkTokenAddresses[network],
    keyHashes[network],
    governanceAddress,
    ethers.BigNumber.from(process.env.SUBSCRIPTION_ID)
  );

  await randomGenerator.deployed();
  console.log(
    "random number generator contract deployed to",
    randomGenerator.address
  );
};

main().catch((err) => {
  throw err;
});
