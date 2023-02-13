import { ethers } from "ethers"
import priceConsumerPolygonMumbai from "../data/priceConsumerPolygonMumbai.json" assert { type: "json" }
import dotenv from "dotenv"
dotenv.config()

const main = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.ALCHEMY_POLYGONMUMBAI || ""
    )
    const wallet = new ethers.Wallet(
        process.env.WALLET_PRIVATE_KEY || "",
        provider
    )
    const PriceConsumer = new ethers.Contract(
        priceConsumerPolygonMumbai.address,
        priceConsumerPolygonMumbai.abi,
        wallet
    )
    // All the feeds bellow are from chainlink (https://docs.chain.link/data-feeds/price-feeds/addresses/?network=polygon), the addresses to the feed could be changed in the future
    // System contract has been used as token for native coin
    console.log("Setting up price feed for ETH token:")
    console.log(
        await PriceConsumer.setFeeds(
            ["0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa"],
            ["0x0715A7794a1dc8e42615F059dD6e406A6594651A"]
        )
    )
    console.log("Setting up price feed for MATIC token:")
    console.log(
        await PriceConsumer.setFeeds(
            ["0x0000000000000000000000000000000000000000"],
            ["0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada"]
        )
    )
    console.log("Setting up price feed for BTC token:")
    console.log(
        await PriceConsumer.setFeeds(
            ["0xaDb88FCc910aBfb2c03B49EE2087e7D6C2Ddb2E9"],
            ["0x007A22900a3B98143368Bd5906f8E17e9867581b"]
        )
    )
    console.log("Setting up price feed for USDC token:")
    console.log(
        await PriceConsumer.setFeeds(
            ["0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747"],
            ["0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0"]
        )
    )
}

main()
    .then(() => (process.exitCode = 0))
    .catch((error) => {
        console.error(error)
        process.exitCode = 1
    })
