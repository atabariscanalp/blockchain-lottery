import { ethers } from "hardhat";
import { getContractAddresses, getDuelAt } from "../utils";

const main = async () => {
  const { duelAddress } = getContractAddresses();
  const duel = await getDuelAt(duelAddress);

  const roomId = ethers.utils.formatBytes32String("4");

  const res = await duel.getRoomCount(roomId);
  console.log("count: ", res.toString());
};

main().catch((err) => console.error(err));
