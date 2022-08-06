import { getRandomGeneratorAt, getContractAddresses } from "../utils";

const main = async () => {
  const { randomGeneratorAddress } = getContractAddresses();
  const randomGeneratorContract = await getRandomGeneratorAt(
    randomGeneratorAddress
  );

  const randomness = await randomGeneratorContract.mostRecentRandomness();
  console.log("most recent randomness: ", randomness.toString());
};

main().catch((err) => console.error(err));
