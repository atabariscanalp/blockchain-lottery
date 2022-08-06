import { deployContracts } from "./utils";

const deploy = async () => {
  await deployContracts("MUMBAI");
};

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
