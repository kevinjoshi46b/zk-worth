import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "@nomiclabs/hardhat-etherscan"
import * as dotenv from "dotenv"
dotenv.config()

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.17",
            },
        ],
    },
    networks: {
        polygonMumbai: {
            url: process.env.ALCHEMY_POLYGONMUMBAI || "",
            accounts: [process.env.WALLET_PRIVATE_KEY || ""],
        },
    },
    etherscan: {
        apiKey: {
            polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
        },
    },
}

export default config
