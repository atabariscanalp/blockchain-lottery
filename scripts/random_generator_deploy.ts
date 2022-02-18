import { ethers } from "hardhat";
import { KOVAN_KEY_HASH, KOVAN_LINK, KOVAN_VRF_COORDINATOR } from "./constants";
import { transferKovanLinkTokenTo } from "./utils";

const deploy = async () => {
  const Governance = await ethers.getContractFactory("Governance");
  const governance = await Governance.deploy();
  await governance.deployed();
  console.log("governance deployed to: ", governance.address);

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
  console.log("random generator deployed to: ", randomGenerator.address);

  await transferKovanLinkTokenTo(randomGenerator.address);

  const Duello = await ethers.getContractFactory("Duel");
  const duello = await Duello.deploy(governance.address);
  await duello.deployed();
  console.log("duello deployed to: ", duello.address);

  const tx2 = await governance.init(randomGenerator.address, duello.address);
  await tx2.wait();
  console.log("done!");
};

function main() {
  deploy()
    .then()
    .catch((err) => console.error(err));
}

main();
