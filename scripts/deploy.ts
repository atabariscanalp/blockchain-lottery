// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import {
  FEE,
  MUMBAI_KEY_HASH,
  MUMBAI_LINK,
  MUMBAI_VRFCOORDINATOR,
} from "./constants";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Governance = await ethers.getContractFactory("Governance");
  const Duello = await ethers.getContractFactory("Duel");
  const Lottery = await ethers.getContractFactory("Lottery");
  const RandomGenerator = await ethers.getContractFactory(
    "RandomNumberGenerator"
  );

  const governance = await Governance.deploy();
  await governance.deployed();
  const duello = await Duello.deploy(governance.address);
  await duello.deployed();
  const lottery = await Lottery.deploy(10, governance.address);
  await lottery.deployed();
  const randomGenerator = await RandomGenerator.deploy(
    MUMBAI_VRFCOORDINATOR,
    MUMBAI_LINK,
    FEE,
    MUMBAI_KEY_HASH,
    governance.address
  );
  await randomGenerator.deployed();

  console.log("Governance deployed to:", governance.address);
  console.log("Duello deployed to:", duello.address);
  console.log("Lottery deployed to:", lottery.address);
  console.log("RandomGenerator deployed to:", randomGenerator.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
