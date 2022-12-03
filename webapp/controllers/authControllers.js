import expressAsyncHandler from 'express-async-handler'
import {
    setAccount,
} from "../utils/zKCryptoNetWorth.js"
import { genKeys, encrypt } from "../utils/cryptography.js"

const login = expressAsyncHandler(async (req, res, next) => {
    return res.send("Login route")
})

const signup = expressAsyncHandler(async (req, res) => {
    const { username, primaryWalletAddress } = req.body

    if (username == undefined) {
        return res.status(400).json({
            error: "Signup data missing",
            message: "Username is not provided",
        })
    }
    if (primaryWalletAddress == undefined) {
        return res.status(400).json({
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
                            data: { password: keys[1] },
                        })
                    } else {
                        return res.status(500).json({
                            error: "Account creation failed",
                            message: "Please try again",
                        })
                    }

                } else {
                    return res.status(500).json({
                        error: "Key generation failed",
                        message: "Please try again",
                    })
                }
            } else {
                return res.status(401).json({
                    error: "Username is not unique",
                    message: "Please check and provide a unique username",
                })
            }
        } else {
            return res.status(500).json({
                error: "Username uniqueness check failed",
                message: "Please try again",
            })
        }
    } else {
        return res.status(401).json({
            error: "Invalid primary wallet address",
            message:
                "The primary wallet address provided is not a valid wallet address",
        })
    }
})

export {
    login, signup
}
