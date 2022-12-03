import hre, { ethers } from "hardhat"
import { writeFileSync, existsSync, mkdirSync } from "fs"

async function main() {
    const ZKWorth = await ethers.getContractFactory("ZKWorth")
    const zKWorth = await ZKWorth.deploy()
    await zKWorth.deployTransaction.wait(5)
    await hre.run("verify:verify", {
        address: zKWorth.address,
    })
    const zKWorthData = JSON.stringify({
        address: zKWorth.address,
        abi: JSON.parse(zKWorth.interface.format("json") as string),
    })
    const directory = "./data/"
    const fileName =
        "zKWorth" +
        hre.hardhatArguments.network?.charAt(0).toUpperCase() +
        hre.hardhatArguments.network?.slice(1) +
        ".json"

    if (!existsSync(directory)) {
        mkdirSync(directory, { recursive: true })
    }
    writeFileSync(directory + fileName, zKWorthData)
}

main()
    .then(() => (process.exitCode = 0))
    .catch((error) => {
        console.error(error)
        process.exitCode = 1
    })
