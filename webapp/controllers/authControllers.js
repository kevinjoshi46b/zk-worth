import expressAsyncHandler from "express-async-handler"
import {
    isUniqueUsername,
    getPrimaryWalletAddress,
    isUniquePublicKey,
    setAccount,
} from "../utils/zKWorth.js"
import { ethers } from "ethers"
import { genKeys, encrypt, decrypt } from "../utils/cryptography.js"
import { generateToken } from "../utils/jwt.js"
import { ADMIN_USERNAMES } from "../env.js"

const login = expressAsyncHandler(async (req, res, next) => {
    const { username, primaryWalletAddress, password } = req.body
    if (username == undefined || username == "") {
        return res.status(200).json({
            error: "Authentication data missing",
            message: "Username is not provided",
        })
    }
    if (primaryWalletAddress == undefined) {
        return res.status(200).json({
            error: "Authentication data missing",
            message: "Primary wallet address is not provided",
        })
    }
    if (password == undefined) {
        return res.status(200).json({
            error: "Authentication data missing",
            message: "Password is not provided",
        })
    }
    if (ethers.utils.isAddress(primaryWalletAddress)) {
        let primaryWalletAddressFetched = await getPrimaryWalletAddress(
            username
        )
        if (primaryWalletAddressFetched.success) {
            try {
                const decryptedPrimaryWalletAddress = decrypt(
                    password,
                    primaryWalletAddressFetched.result
                )
                if (primaryWalletAddress == decryptedPrimaryWalletAddress) {
                    let isAdmin = false
                    ADMIN_USERNAMES.forEach((adminUsername) => {
                        if (username == adminUsername) {
                            isAdmin = true
                        }
                    })
                    return res.status(200).json({
                        message: "Authenticated successfully!",
                        token: generateToken({
                            username,
                            privateKey: password,
                            isAdmin,
                        }),
                    })
                } else {
                    return res.status(200).json({
                        error: "Invalid credentials provided",
                        message:
                            "The password or the primary wallet address do not match with the username provided",
                    })
                }
            } catch (error) {
                return res.status(200).json({
                    error: "Invalid password",
                    message: "The password provided is incorrect or corrupted",
                })
            }
        } else {
            return res.status(200).json({
                error: "Primary wallet address fetch from blockchain failed",
                message: "Please try again",
            })
        }
    } else {
        return res.status(200).json({
            error: "Invalid password",
            message: "The password provided is incorrect or corrupted",
        })
    }
})

const signup = expressAsyncHandler(async (req, res, next) => {
    const { username, primaryWalletAddress } = req.body
    if (username == undefined || username == "") {
        return res.status(200).json({
            error: "Signup data missing",
            message: "Username is not provided",
        })
    }
    if (primaryWalletAddress == undefined) {
        return res.status(200).json({
            error: "Signup data missing",
            message: "Primary wallet address is not provided",
        })
    }
    if (ethers.utils.isAddress(primaryWalletAddress)) {
        const uniqueUsernameCheck = await isUniqueUsername(username)
        if (uniqueUsernameCheck.success) {
            if (uniqueUsernameCheck.result) {
                let keys = genKeys()
                const uniqueKeyCheck = await isUniquePublicKey(keys[0])
                if (uniqueKeyCheck.success && uniqueKeyCheck.result) {
                    const encryptePrimaryWalletAddress = encrypt(
                        keys[0],
                        primaryWalletAddress
                    )
                    const accountCreationResult = await setAccount(
                        username,
                        keys[0],
                        encryptePrimaryWalletAddress
                    )
                    if (accountCreationResult.success) {
                        return res.status(200).json({
                            message: "Registered successfully!",
                            password: keys[1],
                        })
                    } else {
                        return res.status(200).json({
                            error: "Account creation failed",
                            message: "Please try again",
                        })
                    }
                } else {
                    return res.status(200).json({
                        error: "Key generation failed",
                        message: "Please try again",
                    })
                }
            } else {
                return res.status(200).json({
                    error: "Username is not unique",
                    message: "Please check and provide a unique username",
                })
            }
        } else {
            return res.status(200).json({
                error: "Username uniqueness check failed",
                message: "Please try again",
            })
        }
    } else {
        return res.status(200).json({
            error: "Invalid primary wallet address",
            message:
                "The primary wallet address provided is not a valid wallet address",
        })
    }
})

export { login, signup }
