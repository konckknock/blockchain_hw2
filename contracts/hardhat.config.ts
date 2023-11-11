import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: 'http://127.0.0.1:8545',
      // the private key of signers, change it according to your ganache user
      accounts: [
        '0x8e3c3a05ac78a377ef0fb5552db50b0069d556eccaaa4265b5c1aeb133fa95a5',
        '0xdfc0491e57ef4961b2d59103801d80d0f4df227b274a18cc404623ec3a71d5f3',
        '0xfb020f0d5562e64100fc0def137ad129b9198cae5b60ed2fd0ddf8818415fa31',
        '0x4623cbc5286d4a07cc2533efb0f43fa274766f086b4907f7b6f422b190a3ef1f'
      ]
    },
  },
};

export default config;
