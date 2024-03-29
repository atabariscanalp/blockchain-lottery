import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomiclabs/hardhat-ethers";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.15",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    mumbai: {
      url: process.env.MUMBAI_URL,
      accounts: [
        `${process.env.PRIVATE_KEY}`,
        `${process.env.PRIVATE_KEY_2}`,
        `${process.env.PRIVATE_KEY_3}`,
      ],
      timeout: 100000,
    },
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts: [`${process.env.PRIVATE_KEY}`],
      timeout: 100000,
    },
    kovan: {
      url: process.env.KOVAN_URL,
      accounts: [
        `${process.env.PRIVATE_KEY}`,
        `${process.env.PRIVATE_KEY_2}`,
        `${process.env.PRIVATE_KEY_3}`,
      ],
      timeout: 100000,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 1000000,
  },
};

export default config;
