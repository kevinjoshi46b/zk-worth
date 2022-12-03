import { expect } from "chai"
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { ethers } from "hardhat"

describe("ZKWorth Contract", () => {
    const deployZKWorthFixture = async () => {
        const ZKWorth = await ethers.getContractFactory(
            "ZKWorth"
        )
        const [owner, addr1] = await ethers.getSigners()
        const zKWorth = await ZKWorth.deploy()
        await zKWorth.deployed()
        return { ZKWorth, zKWorth, owner, addr1 }
    }

    describe("Deployment", () => {
        it("Should set the right owner", async () => {
            const { zKWorth, owner } = await loadFixture(
                deployZKWorthFixture
            )
            expect(await zKWorth.owner()).to.equal(owner.address)
        })
    })
})