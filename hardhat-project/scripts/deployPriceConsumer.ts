import hre, { ethers } from "hardhat"
import { writeFileSync, existsSync, mkdirSync } from "fs"

async function main() {
    const PriceConsumer = await ethers.getContractFactory("PriceConsumer")
    const priceConsumer = await PriceConsumer.deploy()
    await priceConsumer.deployTransaction.wait(5)
    await hre.run("verify:verify", {
        address: priceConsumer.address,
    })
    const priceConsumerData = JSON.stringify({
        address: priceConsumer.address,
        abi: JSON.parse(priceConsumer.interface.format("json") as string),
    })
    const directory = "./data/"
    const fileName =
        "priceConsumer" +
        hre.hardhatArguments.network?.charAt(0).toUpperCase() +
        hre.hardhatArguments.network?.slice(1) +
        ".json"

    if (!existsSync(directory)) {
        mkdirSync(directory, { recursive: true })
    }
    writeFileSync(directory + fileName, priceConsumerData)
}

main()
    .then(() => (process.exitCode = 0))
    .catch((error) => {
        console.error(error)
        process.exitCode = 1
    })
