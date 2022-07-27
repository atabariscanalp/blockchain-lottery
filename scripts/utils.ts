import { ethers } from "hardhat";
import { NETWORKS } from "./types";
import { keyHashes, linkTokenAddresses, vrfCoordinators } from "./constants";
import fs from "fs";
import contractAddresses from "../contracts.json";

const linkTokenAbi = require("@chainlink/contracts/abi/v0.8/LinkTokenInterface.json");

export const deployContracts = async (network: keyof typeof NETWORKS) => {
  /**
   * deploy governance
   */
  const Governance = await ethers.getContractFactory("Governance");
  const governance = await Governance.deploy();
  await governance.deployed();
  console.log("governance contract deployed to: ", governance.address);

  /**
   * deploy random number generator
   */
  const RandomNumberGenerator = await ethers.getContractFactory(
    "RandomNumberGenerator"
  );
  const randomGenerator = await RandomNumberGenerator.deploy(
    vrfCoordinators[network],
    linkTokenAddresses[network],
    keyHashes[network],
    governance.address,
    ethers.BigNumber.from(process.env.SUBSCRIPTION_ID)
  );
  await randomGenerator.deployed();
  console.log(
    "random number generator contract deployed to: ",
    randomGenerator.address
  );

  /**
   * deploy duel
   */
  const Duel = await ethers.getContractFactory("Duel");
  const duel = await Duel.deploy(governance.address);
  await duel.deployed();
  console.log("duel contract deployed to: ", duel.address);

  /**
   * connect contracts through governance
   */
  const tx = await governance.init(randomGenerator.address, duel.address);
  await tx.wait();

  /**
   * write contract addresses to json file
   */
  console.log("writing contracts...");
  writeToFile("contracts.json", {
    governanceAddress: governance.address,
    randomGeneratorAddress: randomGenerator.address,
    duelAddress: duel.address,
  });

  /**
   * transfer link token to the random generator contract
   */
  await transferLinkTokenTo(randomGenerator.address, network);

  return [governance, randomGenerator, duel];
};

export const wait = async (second: number) => {
  return new Promise((resolve) => setTimeout(resolve, second * 1000));
};

export const transferLinkTokenTo = async (
  address: string,
  network: keyof typeof NETWORKS
) => {
  /**
   * get addresses
   */
  const [owner] = await ethers.getSigners();

  /**
   * create link token
   */
  const linkTokenContract = new ethers.Contract(
    linkTokenAddresses[network],
    linkTokenAbi,
    owner
  );

  /**
   * transfer link token to random number generator contract
   */
  const transferTransaction = await linkTokenContract.transfer(
    address,
    "1000000000000000000"
  );
  await transferTransaction.wait();
  console.log(
    "transfer to random contract completed! ",
    transferTransaction.hash
  );
};

export const getRandomGeneratorAt = async (address: string) => {
  const [owner] = await ethers.getSigners();
  return await ethers.getContractAt("RandomNumberGenerator", address, owner);
};

export const getDuelAt = async (address: string) => {
  const [owner] = await ethers.getSigners();
  return await ethers.getContractAt("Duel", address, owner);
};

const writeToFile = (path: string, data: Record<string, string>) => {
  const writeableData = JSON.stringify(data, null, 2);
  fs.writeFile(path, writeableData, (error) => {
    if (error) throw error;
    console.log("successfully write data to file");
  });
};

export const getContractAddresses = () => {
  return contractAddresses;
};
