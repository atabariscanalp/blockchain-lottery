import { deployContractsToKovan } from "./utils";

const deploy = async () => {
  await deployContractsToKovan();
};

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
