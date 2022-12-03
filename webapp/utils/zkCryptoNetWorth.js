import { ethers } from "ethers"
import { ALCHEMY_POLYGONMUMBAI, WALLET_PRIVATE_KEY } from "../env.js"
import zKCryptoNetWorthGoerli from "./contracts/zKCryptoNetWorthGoerli.json" assert { type: "json" }

const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_POLYGONMUMBAI)
const providerContract = new ethers.Contract(
    zKCryptoNetWorthGoerli.address,
    zKCryptoNetWorthGoerli.abi,
    provider
)
const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider)
const signerContract = providerContract.connect(wallet)

const setAccount = async (username, publicKey, primaryWalletAddress) => {
    try {
        await signerContract.setAccount(
            username,
            publicKey,
            primaryWalletAddress
        )
        return { success: true }
    } catch (error) {
        return { success: false, error }
    }
}

export {
    setAccount
}