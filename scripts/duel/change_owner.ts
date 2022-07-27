import { getContractAddresses, getDuelAt } from "../utils";

const main = async () => {
  const { duelAddress, randomGeneratorAddress } = getContractAddresses();
  const duel = await getDuelAt(duelAddress);

  /**
   * transfers ownership to random generator contract
   */
  await duel.transferOwnership(randomGeneratorAddress);
};

main().catch((err) => console.error(err));
