import { ethers } from "hardhat";
import { KOVAN_KEY_HASH, KOVAN_LINK, KOVAN_VRF_COORDINATOR } from "./constants";

const linkTokenAbi = require("@chainlink/contracts/abi/v0.8/LinkTokenInterface.json");

export const deployContractsToKovan = async () => {
  /**
   * deploy governance
   */
  const Governance = await ethers.getContractFactory("Governance");
  const governance = await Governance.deploy();
  await governance.deployed();
  console.log("governance contract deployed to: ", governance.address);

  /**
   * deploy lottery
   */
  const Lottery = await ethers.getContractFactory("Lottery");
  const lottery = await Lottery.deploy(120, governance.address);
  await lottery.deployed();
  console.log("lottery contract deployed to: ", lottery.address);

  /**
   * deploy random number generator
   */
  const RandomNumberGenerator = await ethers.getContractFactory(
    "RandomNumberGenerator"
  );
  const randomGenerator = await RandomNumberGenerator.deploy(
    KOVAN_VRF_COORDINATOR,
    KOVAN_LINK,
    KOVAN_KEY_HASH,
    governance.address
  );
  await randomGenerator.deployed();
  console.log(
    "random number generator contract deployed to: ",
    randomGenerator.address
  );

  /**
   * deploy duello
   */
  const Duello = await ethers.getContractFactory("Duel");
  const duello = await Duello.deploy(governance.address);
  await duello.deployed();
  console.log("duello contract deployed to: ", duello.address);

  /**
   * connect contracts through governance
   */
  const tx = await governance.init(
    lottery.address,
    randomGenerator.address,
    duello.address
  );
  await tx.wait();

  /**
   * get addresses
   */
  const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

  /**
   * create link token
   */
  const linkTokenContract = new ethers.Contract(
    KOVAN_LINK,
    linkTokenAbi,
    owner
  );

  /**
   * transfer link token to random number generator contract
   */
  const transferTransaction = await linkTokenContract.transfer(
    randomGenerator.address,
    "1000000000000000000"
  );
  await transferTransaction.wait();
  console.log(
    "transfer to random contract completed! ",
    transferTransaction.hash
  );

  /**
   * transfer link token to random number generator contract
   */
  const transferTransaction2 = await linkTokenContract.transfer(
    lottery.address,
    "1000000000000000000"
  );
  await transferTransaction2.wait();
  console.log("transfer to lottery completed! ", transferTransaction2.hash);
};
