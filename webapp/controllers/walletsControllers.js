import expressAsyncHandler from "express-async-handler"
import {
    getPrimaryWalletAddress,
    getSecondaryWalletAddresses,
    removeSecondaryWalletAddress,
    getPublicKey,
    setSecondaryWalletAddress,
} from "../utils/zKCryptoNetWorth.js"
import { encrypt, decrypt } from "../utils/cryptography.js"
import { ethers } from "ethers"

const getWalletAddressesController = expressAsyncHandler(
    async (req, res, next) => {
        let walletAddresses = []
        const fetchedPrimaryWalletAddress = await getPrimaryWalletAddress(
            req.user.username.username
        )
        if (fetchedPrimaryWalletAddress.success) {
            const primaryWalletAddress = decrypt(
                req.user.username.privateKey,
                fetchedPrimaryWalletAddress.result
            )
            walletAddresses.push({
                type: "primary",
                walletAddress: primaryWalletAddress,
            })
            const fetchedSecondaryWalletAddresses =
                await getSecondaryWalletAddresses(req.user.username.username)
            if (fetchedSecondaryWalletAddresses.success) {
                fetchedSecondaryWalletAddresses.result.forEach(
                    (walletAddress) => {
                        walletAddresses.push({
                            type: "secondary",
                            walletAddress: decrypt(
                                req.user.username.privateKey,
                                walletAddress
                            ),
                        })
                    }
                )
                return res.status(200).json({
                    message: "Wallet addresses fetched successfully!",
                    data: walletAddresses,
                })
            } else {
                return res.status(500).json({
                    error: "Fetching secondary wallet addresses from blockchain failed",
                    message: "Please try again",
                })
            }
        } else {
            return res.status(500).json({
                error: "Fetching primary wallet address from blockchain failed",
                message: "Please try again",
            })
        }
    }
)

const setSecondaryWalletAddressController = expressAsyncHandler(
    async (req, res, next) => {
        const { message, signedMessage, secondaryWalletAddress } = req.body
        if (message == undefined) {
            return res.status(400).json({
                error: "Data missing",
                message: "Message is not provided",
            })
        }
        if (signedMessage == undefined) {
            return res.status(400).json({
                error: "Data missing",
                message: "Signed message is not provided",
            })
        }
        if (secondaryWalletAddress == undefined) {
            return res.status(400).json({
                error: "Data missing",
                message: "Secondary wallet address is not provided",
            })
        }
        if (ethers.utils.isAddress(secondaryWalletAddress)) {
            try {
                const signerAddress = ethers.utils.verifyMessage(
                    message,
                    signedMessage
                )
                if (signerAddress == secondaryWalletAddress) {
                    const fetchedPublicKey = await getPublicKey(
                        req.user.username.username
                    )
                    if (fetchedPublicKey.success) {
                        const encryptedSecondaryWalletAddress = encrypt(
                            fetchedPublicKey.result,
                            secondaryWalletAddress
                        )
                        const setSecondaryWalletAddressResult =
                            await setSecondaryWalletAddress(
                                req.user.username.username,
                                encryptedSecondaryWalletAddress
                            )
                        if (setSecondaryWalletAddressResult.success) {
                            return res.status(200).json({
                                message:
                                    "Secondary wallet linked successfully!",
                            })
                        } else {
                            return res.status(500).json({
                                error: "Linking secondary wallet address failed",
                                message: "Please try again",
                            })
                        }
                    } else {
                        return res.status(500).json({
                            error: "Fetching public key from blockchain failed",
                            message: "Please try again",
                        })
                    }
                } else {
                    return res.status(400).json({
                        error: "Invalid secondary wallet address",
                        message:
                            "The message was not signed by the secondary wallet address",
                    })
                }
            } catch (error) {
                return res.status(500).json({
                    error: "Validating signature failed",
                    message: "Please try again",
                })
            }
        } else {
            return res.status(400).json({
                error: "Invalid secondary wallet address",
                message:
                    "The secondary wallet address provided is not a valid wallet address",
            })
        }
    }
)

const removeSecondaryWalletAddressController = expressAsyncHandler(
    async (req, res, next) => {
        const { secondaryWalletAddress } = req.body
        if (secondaryWalletAddress == undefined) {
            return res.status(400).json({
                error: "Data missing",
                message: "Secondary wallet address is not provided",
            })
        }
        if (ethers.utils.isAddress(secondaryWalletAddress)) {
            const fetchedPublicKey = await getPublicKey(
                req.user.username.username
            )
            if (fetchedPublicKey.success) {
                const removeSecondaryWalletAddressResult =
                    await removeSecondaryWalletAddress(
                        req.user.username.username,
                        fetchedPublicKey.result
                    )
                if (removeSecondaryWalletAddressResult.success) {
                    return res.status(200).json({
                        message: "Secondary wallet unlinked successfully!",
                    })
                } else {
                    return res.status(500).json({
                        error: "Unlinking secondary wallet address failed",
                        message: "Please try again",
                    })
                }
            } else {
                return res.status(500).json({
                    error: "Fetching public key from blockchain failed",
                    message: "Please try again",
                })
            }
        } else {
            return res.status(400).json({
                error: "Invalid secondary wallet address",
                message:
                    "The secondary wallet address provided is not a valid wallet address",
            })
        }
    }
)

export {
    getWalletAddressesController,
    setSecondaryWalletAddressController,
    removeSecondaryWalletAddressController,
}
