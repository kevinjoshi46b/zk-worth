import { ethers } from "ethers"
import { ALCHEMY_POLYGONMUMBAI, WALLET_PRIVATE_KEY } from "../env.js"
import zKCryptoNetWorth from "./contracts/zKWorthPolygonMumbai.json" assert {type: 'json'}

const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_POLYGONMUMBAI)
const providerContract = new ethers.Contract(
    zKCryptoNetWorth.address,
    zKCryptoNetWorth.abi,
    provider
)
const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider)
const signerContract = providerContract.connect(wallet)

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

const setAccount = async (username, publicKey, primaryWalletAddress) => {
    try {
        const result = await signerContract.setAccount(
            username,
            publicKey,
            primaryWalletAddress
        )
        await result.wait(1)
        return { success: true }
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
        const result = await signerContract.setSecondaryWalletAddress(
            username,
            secondaryWalletAddress
        )
        await result.wait(1)
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
        const result = await signerContract.removeSecondaryWalletAddress(
            username,
            secondaryWalletAddress
        )
        await result.wait(1)
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
        await result.wait(1)
        return { success: true }
    } catch (error) {
        return { success: false, error }
    }
}

const getLatestId = async () => {
    try {
        const result = await signerContract.getLatestId()
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
        const result = await signerContract.setRequests(
            sender,
            senderId,
            receiver,
            receiverId
        )
        await result.wait(1)
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
    isUniquePublicKey,
    isUniqueUsername,
    setAccount,
    getAccount,
    getPublicKey,
    getPrimaryWalletAddress,
    setSecondaryWalletAddress,
    removeSecondaryWalletAddress,
    getSecondaryWalletAddresses,
    setRequestMetadata,
    getLatestId,
    getRequestMetadata,
    getRequestMetadatas,
    setRequests,
    getRequests,
    getIncomingRequests,
    getOutgoingRequests,
}
