import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "@nomiclabs/hardhat-etherscan"
import * as dotenv from "dotenv"
dotenv.config()

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.0",
            },
            {
                version: "0.8.17",
            },
            {
                version: "0.6.11"
            },
        ],
    },
    networks: {
        hardhat: {
            forking: {
                url: process.env.ALCHEMY_POLYGONMUMBAI || "",
            },
        },
        goerli: {
            url: process.env.ALCHEMY_GOERLI || "",
            accounts: [process.env.WALLET_PRIVATE_KEY || ""],
        },
        polygonMumbai: {
            url: process.env.ALCHEMY_POLYGONMUMBAI || "",
            accounts: [process.env.WALLET_PRIVATE_KEY || ""],
        },
    },
    etherscan: {
        apiKey: {
            goerli: process.env.ETHERSCAN_API_KEY || "",
            polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
        },
    },
}

export default config
