import { expect } from "chai"
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { ethers } from "hardhat"

// These are addresses for USDC token and chainlink USDC feed on goerli, could be changed in the future
const token = "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747"
const feed = "0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0"

describe("PriceConsumer Contract", () => {
    const deployPriceConsumerFixture = async () => {
        const PriceConsumer = await ethers.getContractFactory("PriceConsumer")
        const [owner, addr1] = await ethers.getSigners()
        const priceConsumer = await PriceConsumer.deploy()
        await priceConsumer.deployed()
        return { PriceConsumer, priceConsumer, owner, addr1 }
    }

    describe("Deployment", () => {
        it("Should set the right owner", async () => {
            const { priceConsumer, owner } = await loadFixture(
                deployPriceConsumerFixture
            )
            expect(await priceConsumer.owner()).to.equal(owner.address)
        })
    })

    describe("Transactions", () => {
        describe("setFeeds function", () => {
            it("Should return error Tokens array length is zero", async () => {
                const { priceConsumer, owner } = await loadFixture(
                    deployPriceConsumerFixture
                )
                await expect(priceConsumer.setFeeds([], [])).to.be.revertedWith(
                    "Tokens array length is zero"
                )
            })
            it("Should return error Feeds array length is zero", async () => {
                const { priceConsumer, owner } = await loadFixture(
                    deployPriceConsumerFixture
                )
                await expect(
                    priceConsumer.setFeeds([token], [])
                ).to.be.revertedWith("Feeds array length is zero")
            })
            it("Should return error Arrays length mismatch", async () => {
                const { priceConsumer, owner } = await loadFixture(
                    deployPriceConsumerFixture
                )
                await expect(
                    priceConsumer.setFeeds([token, token], [feed])
                ).to.be.revertedWith("Arrays length mismatch")
            })
            it("Should set feed", async () => {
                const { priceConsumer, owner } = await loadFixture(
                    deployPriceConsumerFixture
                )
                await expect(priceConsumer.setFeeds([token], [feed]))
                    .to.emit(priceConsumer, "SetFeeds")
                    .withArgs(owner.address, 1, [token], [feed])
            })
        })

        describe("getPrice function", () => {
            it("Should return error Tokens array length is zero", async () => {
                const { priceConsumer, owner } = await loadFixture(
                    deployPriceConsumerFixture
                )
                await expect(priceConsumer.getPrice(token)).to.be.revertedWith(
                    "Feed does not exist for this token"
                )
            })
            it("Should return price", async () => {
                const { priceConsumer, owner } = await loadFixture(
                    deployPriceConsumerFixture
                )
                await priceConsumer.setFeeds([token], [feed])
                expect(
                    typeof (await priceConsumer.getPrice(token)).toString()
                ).to.equal(typeof "")
            })
        })

        describe("getPrices function", () => {
            it("Should return prices", async () => {
                const { priceConsumer, owner } = await loadFixture(
                    deployPriceConsumerFixture
                )
                await priceConsumer.setFeeds([token], [feed])
                expect(
                    (await priceConsumer.getPrices([token])).length
                ).to.equal(1)
            })
        })

        describe("getNativeBalance function", () => {
            it("Should return native balance", async () => {
                const { priceConsumer, owner } = await loadFixture(
                    deployPriceConsumerFixture
                )
                expect(
                    await priceConsumer.getNativeBalance(owner.address)
                ).to.equal(await ethers.provider.getBalance(owner.address))
            })
        })

        describe("getBalance function", () => {
            it("Should return balance", async () => {
                const { priceConsumer, owner } = await loadFixture(
                    deployPriceConsumerFixture
                )
                expect(
                    (
                        await priceConsumer.getBalance(owner.address, token)
                    ).toString()
                ).to.equal("1000151")
            })
        })

        describe("getBalances function", () => {
            it("Should return balances", async () => {
                const { priceConsumer, owner } = await loadFixture(
                    deployPriceConsumerFixture
                )
                expect(
                    (
                        await priceConsumer.getBalances(owner.address, [token])
                    )[0].toString()
                ).to.equal("1000151")
            })
        })
    })
})
