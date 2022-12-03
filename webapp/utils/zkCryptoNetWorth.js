import { ethers } from "ethers"
import { ALCHEMY_POLYGONMUMBAI, WALLET_PRIVATE_KEY } from "../env.js"
import zKCryptoNetWorth from "./contracts/zKCryptoNetWorth.json"

const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_POLYGONMUMBAI)
const providerContract = new ethers.Contract(
    zKCryptoNetWorth.address,
    zKCryptoNetWorth.abi,
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

const isUniquePublicKey = async (publicKey) => {
    try {
        const result = await providerContract.isUniquePublicKey(publicKey)
        return { success: true, result }
    } catch (error) {
        return { success: false, error }
    }
}

const isUniqueUsername = async (username) => {
    try {
        const result = await providerContract.isUniqueUsername(username)
        return { success: true, result }
    } catch (error) {
        return { success: false, error }
    }
}


const getAccount = async (username) => {
    try {
        const result = await providerContract.getAccount(username)
        return { success: true, result }
    } catch (error) {
        return { success: false, error }
    }
}

const getPublicKey = async (username) => {
    try {
        const result = await providerContract.getPublicKey(username)
        return { success: true, result }
    } catch (error) {
        return { success: false, error }
    }
}

const getPrimaryWalletAddress = async (username) => {
    try {
        const result = await providerContract.getPrimaryWalletAddress(username)
        return { success: true, result }
    } catch (error) {
        return { success: false, error }
    }
}

const setSecondaryWalletAddress = async (username, secondaryWalletAddress) => {
    try {
        await signerContract.setSecondaryWalletAddress(
            username,
            secondaryWalletAddress
        )
        return { success: true }
    } catch (error) {
        return { success: false, error }
    }
}

const removeSecondaryWalletAddress = async (
    username,
    secondaryWalletAddress
) => {
    try {
        await signerContract.removeSecondaryWalletAddress(
            username,
            secondaryWalletAddress
        )
        return { success: true }
    } catch (error) {
        return { success: false, error }
    }
}

const getSecondaryWalletAddresses = async (username) => {
    try {
        const result = await providerContract.getSecondaryWalletAddresses(
            username
        )
        return { success: true, result }
    } catch (error) {
        return { success: false, error }
    }
}

const setRequestMetadata = async (
    id,
    sender,
    receiver,
    threshold,
    status,
    reqResult,
    proof
) => {
    try {
        const result = await signerContract.setRequestMetadata(
            id,
            sender,
            receiver,
            threshold,
            status,
            reqResult,
            proof
        )
        return { success: true }
    } catch (error) {
        return { success: false, error }
    }
}

const getLatesId = async () => {
    try {
        const result = await providerContract.getLatestId()
        return { success: true, result }
    } catch (error) {
        return { success: false, error }
    }
}

const getRequestMetadata = async (id) => {
    try {
        const result = await providerContract.getRequestMetadata(id)
        return { success: true, result }
    } catch (error) {
        return { success: false, error }
    }
}

const getRequestMetadatas = async (ids) => {
    try {
        const result = await providerContract.getRequestMetadatas(ids)
        return { success: true, result }
    } catch (error) {
        return { success: false, error }
    }
}

const setRequests = async (sender, senderId, receiver, receiverId) => {
    try {
        await signerContract.setRequests(sender, senderId, receiver, receiverId)
        return { success: true }
    } catch (error) {
        return { success: false, error }
    }
}

const getRequests = async (username) => {
    try {
        const result = await providerContract.getRequests(username)
        return { success: true, result }
    } catch (error) {
        return { success: false, error }
    }
}

const getIncomingRequests = async (username) => {
    try {
        const result = await providerContract.getIncomingRequests(username)
        return { success: true, result }
    } catch (error) {
        return { success: false, error }
    }
}

const getOutgoingRequests = async (username) => {
    try {
        const result = await providerContract.getOutgoingRequests(username)
        return { success: true, result }
    } catch (error) {
        return { success: false, error }
    }
}

export {
    setAccount,
    isUniquePublicKey,
    isUniqueUsername,
    getAccount,
    getPublicKey,
    getPrimaryWalletAddress,
    setSecondaryWalletAddress,
    removeSecondaryWalletAddress,
    getSecondaryWalletAddresses,
    setRequestMetadata,
    getLatesId,
    getRequestMetadata,
    getRequestMetadatas,
    setRequests,
    getRequests,
    getIncomingRequests,
    getOutgoingRequests,
}
