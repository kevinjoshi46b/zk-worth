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

    if (ethers.utils.isAddress(primaryWalletAddress)) {
        let keys = genKeys()

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
