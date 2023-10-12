import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const PRIVATE_KEY = process.env.PRIVATE_KEY
const accounts = PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : []

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    dev: {
      url: "http://127.0.0.1:8545"
    },
    iotex_testnet: {
      url: "https://babel-api.testnet.iotex.io",
      accounts: accounts,
    }
  },
  solidity: {
    version: "0.8.13",
    settings: {
      optimizer: {
        enabled: true,
        runs: 10000,
      },
      metadata: {
        bytecodeHash: 'none',
      },
    }
  },
  typechain: {
    outDir: "types"
  },
};

export default config;
