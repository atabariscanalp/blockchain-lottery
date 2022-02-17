import { ethers } from "hardhat";

const GOVERNANCE_ADDRESS = "0x61b8b28590Ee00265416231ce1c1f8557f13538f";
const LOTTERY_ADDRESS = "0xDF99743cFe90b9ef4940aBB457FFB0CB01d8BBE4";
const RANDOM_ADDRESS = "0x8c7b5542075d54015594Ac28B5Ebe18458904EB3";
const DUEL_ADDRESS = "0xD103f861F609e3D05D6598bE511D2e5D4DEe028F";

const initGovernance = async () => {
  const [owner] = await ethers.getSigners();
  const governance = await ethers.getContractAt(
    "Governance",
    GOVERNANCE_ADDRESS,
    owner
  );

  const tx1 = await governance.init(
    LOTTERY_ADDRESS,
    RANDOM_ADDRESS,
    DUEL_ADDRESS
  );
  await tx1.wait();
};

initGovernance()
  .then()
  .catch((err) => console.error(err));
