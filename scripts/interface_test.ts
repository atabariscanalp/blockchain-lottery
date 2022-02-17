import { ethers } from "hardhat";
import {
  RINKEBY_KEY_HASH,
  RINKEBY_LINK,
  RINKEBY_VRFCOORDINATOR,
} from "./constants";

const deploy = async () => {
  const Governance = await ethers.getContractFactory("Governance");
  const governance = await Governance.deploy();
  await governance.deployed();

  const RandomNumberGenerator = await ethers.getContractFactory(
    "RandomNumberGenerator"
  );

  const randomGenerator = await RandomNumberGenerator.deploy(
    RINKEBY_VRFCOORDINATOR,
    RINKEBY_LINK,
    RINKEBY_KEY_HASH,
    governance.address
  );
  await randomGenerator.deployed();

  const Lottery = await ethers.getContractFactory("Lottery");
  const lottery = await Lottery.deploy(120, governance.address);
  await lottery.deployed();

  const tx = await governance.init(
    lottery.address,
    randomGenerator.address,
    lottery.address
  );
  await tx.wait();

  console.log("random generator deployed to: ", randomGenerator.address);
  console.log("governance deployed to: ", governance.address);
  console.log("lottery deployed to: ", lottery.address);

  const res = await lottery.getSum(10, 11);
  console.log("SUM: ", res.toString());
};

function main() {
  deploy()
    .then()
    .catch((err) => console.error(err));
}

main();
