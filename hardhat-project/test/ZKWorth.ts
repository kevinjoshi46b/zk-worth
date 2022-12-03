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

    describe("Transactions", () => {
        describe("isUniquePublicKey function", () => {
            it("Should return true", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                expect(
                    await zKWorth.isUniquePublicKey("abc")
                ).to.equal(true)
            })
            it("Should return false", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                zKWorth.setAccount("kevin", "abc", "xyz")
                expect(
                    await zKWorth.isUniquePublicKey("abc")
                ).to.equal(false)
            })
        })

        describe("isUniqueUsername function", () => {
            it("Should return true", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                expect(
                    await zKWorth.isUniqueUsername("kevin")
                ).to.equal(true)
            })
            it("Should return false", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await zKWorth.setAccount("kevin", "abc", "xyz")
                expect(
                    await zKWorth.isUniqueUsername("kevin")
                ).to.equal(false)
            })
        })

        describe("createAccount function", () => {
            it("Should return error Username not provided", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await expect(
                    zKWorth.setAccount("", "", "")
                ).to.be.revertedWith("Username not provided")
            })
            it("Should return error Public key not provided", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await expect(
                    zKWorth.setAccount("kevin", "", "")
                ).to.be.revertedWith("Public key not provided")
            })
            it("Should return error Primary wallet address not provided", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await expect(
                    zKWorth.setAccount("kevin", "abc", "")
                ).to.be.revertedWith("Primary wallet address not provided")
            })
            it("Should return error Account with the given username already exists", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await zKWorth.setAccount("kevin", "abc", "xyz")
                await expect(
                    zKWorth.setAccount("kevin", "abc", "xyz")
                ).to.be.revertedWith(
                    "Account with the given username already exists"
                )
            })
            it("Should return error Ownable: caller is not the owner", async () => {
                const { zKWorth, addr1 } = await loadFixture(
                    deployZKWorthFixture
                )
                await expect(
                    zKWorth
                        .connect(addr1)
                        .setAccount("kevin", "123", "123")
                ).to.be.revertedWith("Ownable: caller is not the owner")
            })
            it("Should set account", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await zKWorth.setAccount("kevin", "abc", "xyz")
                expect(
                    await zKWorth.isUniqueUsername("kevin")
                ).to.equal(false)
            })
        })

        describe("getAccount function", () => {
            it("Should return the User struct", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await zKWorth.setAccount("kevin", "abc", "xyz")
                expect(
                    (await zKWorth.getAccount("kevin"))
                        .primaryWalletAddress
                ).to.equal("xyz")
            })
        })

        describe("getPublicKey function", () => {
            it("Should return error Account with the given username does not exist", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await expect(
                    zKWorth.getPublicKey("")
                ).to.be.revertedWith(
                    "Account with the given username does not exist"
                )
            })
            it("Should return public key", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await zKWorth.setAccount("kevin", "abc", "xyz")
                expect(await zKWorth.getPublicKey("kevin")).to.equal(
                    "abc"
                )
            })
        })

        describe("getPrimaryWalletAddress function", () => {
            it("Should return primary wallet address", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await zKWorth.setAccount("kevin", "abc", "xyz")
                expect(
                    await zKWorth.getPrimaryWalletAddress("kevin")
                ).to.equal("xyz")
            })
        })

        describe("setSecondaryWalletAddress function", () => {
            it("Should return error Account with the given username does not exist", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await expect(
                    zKWorth.setSecondaryWalletAddress("kevin", "xyz")
                ).to.be.revertedWith(
                    "Account with the given username does not exist"
                )
            })
            it("Should return error Secondary wallet address not provided", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await zKWorth.setAccount("kevin", "abc", "xyz")
                await expect(
                    zKWorth.setSecondaryWalletAddress("kevin", "")
                ).to.be.revertedWith("Secondary wallet address not provided")
            })
            it("Should set secondary wallet address", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await zKWorth.setAccount("kevin", "abc", "xyz")
                await zKWorth.setSecondaryWalletAddress(
                    "kevin",
                    "xyz2"
                )
                expect(
                    (
                        await zKWorth.getSecondaryWalletAddresses(
                            "kevin"
                        )
                    )[0]
                ).to.equal("xyz2")
            })
        })

        describe("removeSecondaryWalletAddress function", () => {
            it("Should return error Account with the given username does not exist", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await expect(
                    zKWorth.removeSecondaryWalletAddress(
                        "kevin",
                        "xyz"
                    )
                ).to.be.revertedWith(
                    "Account with the given username does not exist"
                )
            })
            it("Should return error Secondary wallet address not provided", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await zKWorth.setAccount("kevin", "abc", "xyz")
                await expect(
                    zKWorth.removeSecondaryWalletAddress("kevin", "")
                ).to.be.revertedWith("Secondary wallet address not provided")
            })
            it("Should remove secondary wallet address", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await zKWorth.setAccount("kevin", "abc", "xyz")
                await zKWorth.setSecondaryWalletAddress(
                    "kevin",
                    "xyz2"
                )
                await zKWorth.removeSecondaryWalletAddress(
                    "kevin",
                    "xyz2"
                )
                expect(
                    (
                        await zKWorth.getSecondaryWalletAddresses(
                            "kevin"
                        )
                    ).length
                ).to.equal(0)
            })
        })

        describe("getSecondaryWalletAddress function", () => {
            it("Should return secondary wallet addresses", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await zKWorth.setAccount("kevin", "abc", "xyz")
                await zKWorth.setSecondaryWalletAddress(
                    "kevin",
                    "xyz2"
                )
                expect(
                    (
                        await zKWorth.getSecondaryWalletAddresses(
                            "kevin"
                        )
                    )[0]
                ).to.equal("xyz2")
            })
        })

        describe("setRequestMetadata function", () => {
            it("Should return error Request sender not provided", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await expect(
                    zKWorth.setRequestMetadata(
                        0,
                        "",
                        "neelansh",
                        50,
                        0,
                        true,
                        ethers.utils.formatBytes32String("")
                    )
                ).to.be.revertedWith("Request sender not provided")
            })
            it("Should return error Request receiver not provided", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await expect(
                    zKWorth.setRequestMetadata(
                        0,
                        "kevin",
                        "",
                        50,
                        0,
                        true,
                        ethers.utils.formatBytes32String("")
                    )
                ).to.be.revertedWith("Request receiver not provided")
            })
            it("Should return error Ownable: caller is not the owner", async () => {
                const { zKWorth, addr1 } = await loadFixture(
                    deployZKWorthFixture
                )
                await expect(
                    zKWorth
                        .connect(addr1)
                        .setRequestMetadata(
                            0,
                            "kevin",
                            "neelansh",
                            50,
                            0,
                            true,
                            ethers.utils.formatBytes32String("")
                        )
                ).to.be.revertedWith("Ownable: caller is not the owner")
            })
            it("Should set request metadata", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await zKWorth.setRequestMetadata(
                    0,
                    "kevin",
                    "neelansh",
                    50,
                    0,
                    true,
                    ethers.utils.formatBytes32String("")
                )
                expect(
                    (await zKWorth.getRequestMetadata(1)).sender
                ).to.equal("kevin")
            })
            it("Should update request metadata", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await zKWorth.setRequestMetadata(
                    0,
                    "kevin",
                    "neelansh",
                    50,
                    0,
                    true,
                    ethers.utils.formatBytes32String("")
                )
                await zKWorth.setRequestMetadata(
                    1,
                    "kevin",
                    "neelansh",
                    55,
                    0,
                    true,
                    ethers.utils.formatBytes32String("")
                )
                expect(
                    (await zKWorth.getRequestMetadata(1)).threshold
                ).to.equal(55)
            })
            it("Should return error Invalid id provided for metadata which is being updated but the id provided is invalid", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await expect(
                    zKWorth.setRequestMetadata(
                        1,
                        "kevin",
                        "neelansh",
                        50,
                        0,
                        true,
                        ethers.utils.formatBytes32String("")
                    )
                ).to.be.revertedWith("Invalid id provided")
            })
        })

        describe("getLatesId function", () => {
            it("Should return error Ownable: caller is not the owner", async () => {
                const { zKWorth, addr1 } = await loadFixture(
                    deployZKWorthFixture
                )
                await expect(
                    zKWorth.connect(addr1).getLatestId()
                ).to.be.revertedWith("Ownable: caller is not the owner")
            })
            it("Should return latest Id", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                expect(await zKWorth.getLatestId()).to.equal(0)
            })
        })

        describe("getRequestMetadata function", () => {
            it("Should return error Invalid id provided when id is 0", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await expect(
                    zKWorth.getRequestMetadata(0)
                ).to.be.revertedWith("Invalid id provided")
            })
            it("Should return error Invalid id provided when id doesnt exist", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await expect(
                    zKWorth.getRequestMetadata(1)
                ).to.be.revertedWith("Invalid id provided")
            })
            it("Should return request metadata", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await zKWorth.setRequestMetadata(
                    0,
                    "kevin",
                    "neelansh",
                    50,
                    0,
                    true,
                    ethers.utils.formatBytes32String("")
                )
                expect(
                    (await zKWorth.getRequestMetadata(1)).sender
                ).to.equal("kevin")
            })
        })

        describe("getRequestMetadatas function", () => {
            it("Should return error One of the id provided is invalid when id is 0", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await expect(
                    zKWorth.getRequestMetadatas([0])
                ).to.be.revertedWith("One of the id provided is invalid")
            })
            it("Should return error One of the id provided is invalid when id doesnt exist", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await expect(
                    zKWorth.getRequestMetadatas([1])
                ).to.be.revertedWith("One of the id provided is invalid")
            })
            it("Should return request metadatas for one id", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await zKWorth.setRequestMetadata(
                    0,
                    "kevin",
                    "neelansh",
                    50,
                    0,
                    true,
                    ethers.utils.formatBytes32String("")
                )
                expect(
                    (await zKWorth.getRequestMetadatas([1]))[0].sender
                ).to.equal("kevin")
            })
            it("Should return request metadatas for multiple ids", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await zKWorth.setRequestMetadata(
                    0,
                    "kevin",
                    "neelansh",
                    50,
                    0,
                    true,
                    ethers.utils.formatBytes32String("")
                )
                await zKWorth.setRequestMetadata(
                    0,
                    "neelansh",
                    "kevin",
                    50,
                    0,
                    true,
                    ethers.utils.formatBytes32String("")
                )
                expect(
                    (await zKWorth.getRequestMetadatas([1, 2]))[1]
                        .sender
                ).to.equal("neelansh")
            })
        })

        describe("setRequests function", () => {
            it("Should return error Request sender not provided", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await expect(
                    zKWorth.setRequests("", "", "", "")
                ).to.be.revertedWith("Request sender not provided")
            })
            it("Should return error Sender's account does not exist", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await expect(
                    zKWorth.setRequests("kevin", "", "", "")
                ).to.be.revertedWith("Sender's account does not exist")
            })
            it("Should return error Sender's request id not provided", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await zKWorth.setAccount("kevin", "abc", "xyz")
                await expect(
                    zKWorth.setRequests("kevin", "", "", "")
                ).to.be.revertedWith("Sender's request id not provided")
            })
            it("Should return error Request receiver not provided", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await zKWorth.setAccount("kevin", "abc", "xyz")
                await expect(
                    zKWorth.setRequests("kevin", "x1", "", "")
                ).to.be.revertedWith("Request receiver not provided")
            })
            it("Should return error Receiver's account does not exist", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await zKWorth.setAccount("kevin", "abc", "xyz")
                await expect(
                    zKWorth.setRequests("kevin", "x1", "neelansh", "")
                ).to.be.revertedWith("Receiver's account does not exist")
            })
            it("Should return error Receiver's request id not provided", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await zKWorth.setAccount("kevin", "abc", "xyz")
                await zKWorth.setAccount("neelansh", "abc", "xyz")
                await expect(
                    zKWorth.setRequests("kevin", "x1", "neelansh", "")
                ).to.be.revertedWith("Receiver's request id not provided")
            })
            it("Should return error Ownable: caller is not the owner", async () => {
                const { zKWorth, addr1 } = await loadFixture(
                    deployZKWorthFixture
                )
                await expect(
                    zKWorth
                        .connect(addr1)
                        .setRequests("kevin", "x1", "neelansh", "y1")
                ).to.be.revertedWith("Ownable: caller is not the owner")
            })
            it("Should set the requests", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await zKWorth.setAccount("kevin", "abc", "xyz")
                await zKWorth.setAccount("neelansh", "abc", "xyz")
                await zKWorth.setRequests(
                    "kevin",
                    "x1",
                    "neelansh",
                    "y1"
                )
                expect(
                    (await zKWorth.getRequests("kevin"))[1][0]
                ).to.equal("x1")
            })
        })

        describe("getRequests function", () => {
            it("Should return requests", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await zKWorth.setAccount("kevin", "abc", "xyz")
                await zKWorth.setAccount("neelansh", "abc", "xyz")
                await zKWorth.setRequests(
                    "kevin",
                    "x1",
                    "neelansh",
                    "y1"
                )
                expect(
                    (await zKWorth.getRequests("kevin"))[1][0]
                ).to.equal("x1")
            })
        })

        describe("getIncomingRequests function", () => {
            it("Should return incoming requests", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await zKWorth.setAccount("kevin", "abc", "xyz")
                await zKWorth.setAccount("neelansh", "abc", "xyz")
                await zKWorth.setRequests(
                    "kevin",
                    "x1",
                    "neelansh",
                    "y1"
                )
                expect(
                    (await zKWorth.getIncomingRequests("neelansh"))[0]
                ).to.equal("y1")
            })
        })

        describe("getOutgoingRequests function", () => {
            it("Should return outgoing requests", async () => {
                const { zKWorth } = await loadFixture(
                    deployZKWorthFixture
                )
                await zKWorth.setAccount("kevin", "abc", "xyz")
                await zKWorth.setAccount("neelansh", "abc", "xyz")
                await zKWorth.setRequests(
                    "kevin",
                    "x1",
                    "neelansh",
                    "y1"
                )
                expect(
                    (await zKWorth.getOutgoingRequests("kevin"))[0]
                ).to.equal("x1")
            })
        })
    })
})
