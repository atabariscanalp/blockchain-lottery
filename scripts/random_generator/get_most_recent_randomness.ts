import { getRandomGeneratorAt } from "../utils";

const main = async () => {
  const randomGeneratorContract = await getRandomGeneratorAt(
    "0x061A25661EE9C02A944106E71706a03a84855082"
  );

  const randomness = await randomGeneratorContract.mostRecentRandomness();
  console.log("most recent randomness: ", randomness.toString());
};

main().catch((err) => console.error(err));
