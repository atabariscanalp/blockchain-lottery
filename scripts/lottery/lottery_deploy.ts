import { deployContractsToKovan } from "../utils";

const deploy = async () => {
  await deployContractsToKovan();
};

function main() {
  deploy()
    .then()
    .catch((err) => console.error(err));
}

main();
