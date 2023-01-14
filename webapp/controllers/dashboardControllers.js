import expressAsyncHandler from "express-async-handler"
import { ethers } from "ethers"
import {
    setFeeds,
    getPrices,
    getNativeBalance,
    getBalances,
} from "../utils/priceConsumer.js"

const getPricesController = expressAsyncHandler(async (req, res, next) => {
    const { tokens, network } = req.query
    if (tokens == undefined || tokens.length == 0) {
        return res.status(200).json({
            error: "Data missing",
            message: "Tokens are not provided",
        })
    }
    tokens.forEach((token) => {
        if (!ethers.utils.isAddress(token)) {
            return res.status(200).json({
                error: "Invalid token",
                message: "One of the token address provided is invalid",
            })
        }
    })
    if (network == undefined) {
        return res.status(200).json({
            error: "Data missing",
            message: "Network is not provided",
        })
    }
    const fetchedPrices = await getPrices(tokens, network)
    if (fetchedPrices.success) {
        return res.status(200).json({
            message: "Fetched prices from blockchain successfully!",
            data: fetchedPrices.result,
        })
    } else {
        if (fetchedPrices.error == "Provided network is not supported yet!") {
            return res.status(200).json({
                error: "Provided network is not supported yet!",
                message: "Please try again later",
            })
        } else {
            return res.status(200).json({
                error: "Fetching prices from blockchain failed",
                message: "Please try again",
            })
        }
    }
})

const getQuantityController = expressAsyncHandler(async (req, res, next) => {
    const { walletAddress, tokens, network } = req.query
    if (walletAddress == undefined) {
        return res.status(200).json({
            error: "Data missing",
            message: "Wallet address is not provided",
        })
    }
    if (!ethers.utils.isAddress(walletAddress)) {
        return res.status(200).json({
            error: "Invalid wallet address",
            message: "Wallet address provided is invalid",
        })
    }
    if (tokens == undefined || tokens.length == 0) {
        return res.status(200).json({
            error: "Data missing",
            message: "Tokens are not provided",
        })
    }
    tokens.forEach((token) => {
        if (!ethers.utils.isAddress(token)) {
            return res.status(200).json({
                error: "Invalid token",
                message: "One of the token address provided is invalid",
            })
        }
    })
    if (network == undefined) {
        return res.status(200).json({
            error: "Data missing",
            message: "Network is not provided",
        })
    }
    const fetchedNativeBalance = await getNativeBalance(walletAddress, network)
    if (fetchedNativeBalance.success) {
        const fetchedBalances = await getBalances(
            walletAddress,
            tokens,
            network
        )
        if (fetchedBalances.success) {
            let quantity = [fetchedNativeBalance.result]
            fetchedBalances.result.forEach((balance) => {
                quantity.push(balance)
            })
            return res.status(200).json({
                message: `Fetched quantity for ${walletAddress} wallet from ${network} network successfully!`,
                data: quantity,
            })
        } else {
            if (
                fetchedBalances.error ==
                "Provided network is not supported yet!"
            ) {
                return res.status(200).json({
                    error: "Provided network is not supported yet!",
                    message: "Please try again later",
                })
            } else {
                return res.status(200).json({
                    error: "Fetching balances from blockchain failed",
                    message: "Please try again",
                })
            }
        }
    } else {
        if (
            fetchedNativeBalance.error ==
            "Provided network is not supported yet!"
        ) {
            return res.status(200).json({
                error: "Provided network is not supported yet!",
                message: "Please try again later",
            })
        } else {
            return res.status(200).json({
                error: "Fetching balances from blockchain failed",
                message: "Please try again",
            })
        }
    }
})

const setFeedsController = expressAsyncHandler(async (req, res, next) => {
    const { tokens, feeds, network } = req.body
    if (tokens == undefined || tokens.length == 0) {
        return res.status(200).json({
            error: "Data missing",
            message: "Tokens are not provided",
        })
    }
    tokens.forEach((token) => {
        if (!ethers.utils.isAddress(token)) {
            return res.status(200).json({
                error: "Invalid token",
                message: "One of the token address provided is invalid",
            })
        }
    })
    if (feeds == undefined || feeds.length == 0) {
        return res.status(200).json({
            error: "Data missing",
            message: "Feeds are not provided",
        })
    }
    feeds.forEach((feed) => {
        if (!ethers.utils.isAddress(feed)) {
            return res.status(200).json({
                error: "Invalid feed",
                message: "One of the feed address provided is invalid",
            })
        }
    })
    if (tokens.length != feeds.length) {
        return res.status(200).json({
            error: "Data missing",
            message: "Equal no of tokens and feeds are not provided",
        })
    }
    if (network == undefined) {
        return res.status(200).json({
            error: "Data missing",
            message: "Network is not provided",
        })
    }
    const setFeedsResult = await setFeeds(tokens, feeds, network)
    if (setFeedsResult.success) {
        return res.status(200).json({
            message: "Feeds added successfully!",
        })
    } else {
        if (setFeedsResult.error == "Provided network is not supported yet!") {
            return res.status(200).json({
                error: "Provided network is not supported yet!",
                message: "Please try again later",
            })
        } else {
            return res.status(200).json({
                error: "Updating feeds on blockchain failed",
                message: "Please try again",
            })
        }
    }
})

export { getPricesController, getQuantityController, setFeedsController }
