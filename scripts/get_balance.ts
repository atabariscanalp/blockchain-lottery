import { ethers } from "hardhat";

const main = async () => {
  const [deployer] = await ethers.getSigners();

  const balance = await deployer.getBalance();
  const etherBalance = ethers.utils.formatEther(balance);

  console.log("balance", etherBalance.toString());
  console.log("address", await deployer.getAddress());
};

main()
  .then()
  .catch((err) => console.error(err));
