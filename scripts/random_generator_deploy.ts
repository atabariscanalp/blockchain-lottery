import { ethers } from "hardhat";
import { KOVAN_KEY_HASH, KOVAN_LINK, KOVAN_VRF_COORDINATOR } from "./constants";

const linkTokenAbi = require("@chainlink/contracts/abi/v0.8/LinkTokenInterface.json");
const GOVERNANCE_ADDRESS = "0x61b8b28590Ee00265416231ce1c1f8557f13538f";

const deploy = async () => {
  const RandomNumberGenerator = await ethers.getContractFactory(
    "RandomNumberGenerator"
  );
  const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

  const randomGenerator = await RandomNumberGenerator.deploy(
    KOVAN_VRF_COORDINATOR,
    KOVAN_LINK,
    KOVAN_KEY_HASH,
    GOVERNANCE_ADDRESS
  );
  await randomGenerator.deployed();

  console.log("random generator deployed to: ", randomGenerator.address);

  const linkTokenContract = new ethers.Contract(
    KOVAN_LINK,
    linkTokenAbi,
    owner
  );
  const transferTransaction = await linkTokenContract.transfer(
    randomGenerator.address,
    "1000000000000000000"
  );
  await transferTransaction.wait();
  console.log("transfer transaction hash: ", transferTransaction.hash);

  const governance = await ethers.getContractAt(
    "Governance",
    GOVERNANCE_ADDRESS,
    owner
  );
  console.log("governance: ", governance.address);
  console.log("governance signer: ", await governance.signer.getAddress());

  const tx2 = await governance.init(
    "0xDF99743cFe90b9ef4940aBB457FFB0CB01d8BBE4",
    randomGenerator.address,
    "0xD103f861F609e3D05D6598bE511D2e5D4DEe028F"
  );
  await tx2.wait();
  console.log("done!");
};

function main() {
  deploy()
    .then()
    .catch((err) => console.error(err));
}

main();
