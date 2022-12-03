import hre, { ethers } from "hardhat"
import { writeFileSync, existsSync, mkdirSync } from "fs"

async function main() {
    const Verifier = await ethers.getContractFactory("Verifier")
    const verifier = await Verifier.deploy()
    await verifier.deployTransaction.wait(5)
    await hre.run("verify:verify", {
        address: verifier.address,
    })
    const verifierData = JSON.stringify({
        address: verifier.address,
        abi: JSON.parse(verifier.interface.format("json") as string),
    })
    const directory = "./data/"
    const fileName =
        "verifier" +
        hre.hardhatArguments.network?.charAt(0).toUpperCase() +
        hre.hardhatArguments.network?.slice(1) +
        ".json"

    if (!existsSync(directory)) {
        mkdirSync(directory, { recursive: true })
    }
    writeFileSync(directory + fileName, verifierData)
}

main()
    .then(() => (process.exitCode = 0))
    .catch((error) => {
        console.error(error)
        process.exitCode = 1
    })
