import expressAsyncHandler from "express-async-handler"
import {
    getPrimaryWalletAddress,
    getSecondaryWalletAddresses,
    removeSecondaryWalletAddress,
    getPublicKey,
    setSecondaryWalletAddress,
} from "../utils/zKWorth.js"
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
                            isLoading: false,
                        })
                    }
                )
                return res.status(200).json({
                    message: "Wallet addresses fetched successfully!",
                    data: walletAddresses,
                })
            } else {
                return res.status(200).json({
                    error: "Fetching secondary wallet addresses from blockchain failed",
                    message: "Please try again",
                })
            }
        } else {
            return res.status(200).json({
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
            return res.status(200).json({
                error: "Data missing",
                message: "Message is not provided",
            })
        }
        if (signedMessage == undefined) {
            return res.status(200).json({
                error: "Data missing",
                message: "Signed message is not provided",
            })
        }
        if (secondaryWalletAddress == undefined) {
            return res.status(200).json({
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
                    let walletAddresses = []
                    const fetchedPrimaryWalletAddress =
                        await getPrimaryWalletAddress(
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
                            await getSecondaryWalletAddresses(
                                req.user.username.username
                            )
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
                            for (let i = 0; i < walletAddresses.length; i++) {
                                if (
                                    walletAddresses[i].walletAddress ==
                                    secondaryWalletAddress
                                ) {
                                    if (walletAddresses[i].type === "primary") {
                                        return res.status(200).json({
                                            error: "Primary wallet cannot be relinked",
                                            message:
                                                "Please try linking another wallet",
                                        })
                                    } else {
                                        return res.status(200).json({
                                            error: "Secondary wallet has already been linked",
                                            message:
                                                "Please try linking another wallet",
                                        })
                                    }
                                }
                            }
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
                                    return res.status(200).json({
                                        error: "Linking secondary wallet failed",
                                        message: "Please try again",
                                    })
                                }
                            } else {
                                return res.status(200).json({
                                    error: "Linking secondary wallet failed",
                                    message: "Please try again",
                                })
                            }
                        } else {
                            return res.status(200).json({
                                error: "Linking secondary wallet failed",
                                message: "Please try again",
                            })
                        }
                    } else {
                        return res.status(200).json({
                            error: "Linking secondary wallet failed",
                            message: "Please try again",
                        })
                    }
                } else {
                    return res.status(200).json({
                        error: "Invalid secondary wallet address",
                        message:
                            "The message was not signed by the secondary wallet address",
                    })
                }
            } catch (error) {
                return res.status(200).json({
                    error: "Validating signature failed",
                    message: "Please try again",
                })
            }
        } else {
            return res.status(200).json({
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
            return res.status(200).json({
                error: "Data missing",
                message: "Secondary wallet address is not provided",
            })
        }
        if (ethers.utils.isAddress(secondaryWalletAddress)) {
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
                    await getSecondaryWalletAddresses(
                        req.user.username.username
                    )
                if (fetchedSecondaryWalletAddresses.success) {
                    fetchedSecondaryWalletAddresses.result.forEach(
                        (walletAddress) => {
                            walletAddresses.push({
                                type: "secondary",
                                walletAddress: decrypt(
                                    req.user.username.privateKey,
                                    walletAddress
                                ),
                                encryptedWalletAddress: walletAddress,
                            })
                        }
                    )
                    let encrptedWalletAddress = undefined
                    for (let i = 0; i < walletAddresses.length; i++) {
                        if (
                            walletAddresses[i].walletAddress ==
                            secondaryWalletAddress
                        ) {
                            if (walletAddresses[i].type == "primary") {
                                return res.status(200).json({
                                    error: "Primary wallet cannot be unlinked",
                                    message:
                                        "Please try unlinking secondary wallets",
                                })
                            } else {
                                encrptedWalletAddress =
                                    walletAddresses[i].encryptedWalletAddress
                            }
                        }
                    }
                    if (encrptedWalletAddress == undefined) {
                        return res.status(200).json({
                            error: "Secondary wallet address provided is not linked",
                            message:
                                "Please try unlinking other linked secondary wallet addresses",
                        })
                    }
                    const removeSecondaryWalletAddressResult =
                        await removeSecondaryWalletAddress(
                            req.user.username.username,
                            encrptedWalletAddress
                        )
                    if (removeSecondaryWalletAddressResult.success) {
                        return res.status(200).json({
                            message: "Secondary wallet unlinked successfully!",
                        })
                    } else {
                        return res.status(200).json({
                            error: "Unlinking secondary wallet failed",
                            message: "Please try again",
                        })
                    }
                } else {
                    return res.status(200).json({
                        error: "Unlinking secondary wallet failed",
                        message: "Please try again",
                    })
                }
            } else {
                return res.status(200).json({
                    error: "Unlinking secondary wallet failed",
                    message: "Please try again",
                })
            }
        } else {
            return res.status(200).json({
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
