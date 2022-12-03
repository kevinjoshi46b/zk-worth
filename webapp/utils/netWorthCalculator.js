import { ethers } from "ethers"
import { getPrices, getNativeBalance, getBalances } from "./priceConsumer.js"
import {
    getPrimaryWalletAddress,
    getSecondaryWalletAddresses,
} from "./zKCryptoNetWorth.js"
import { decrypt } from "./cryptography.js"

// These constants can be updated when support for more netowrks or coins is added
const pricesRef = [
    {
        network: "polygonMumbai",
        tokens: [
            "0xBA47cF08bDFbA09E7732c0e48E12a11Cd1536bcd",
            "0x0000000000000000000000000000000000000000",
            "0xaDb88FCc910aBfb2c03B49EE2087e7D6C2Ddb2E9",
            "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747",
        ],
        cryptoName: ["Eth", "Matic", "BTC", "USDC"],
    },
]

const balancesRef = [
    {
        network: "goerli",
        tokens: [
            "",
            "0xA108830A23A9a054FfF4470a8e6292da0886A4D4",
            "0xda4a47edf8ab3c5eeeb537a97c5b66ea42f49cda",
            "0xd35CCeEAD182dcee0F148EbaC9447DA2c4D449c4",
        ],
        cryptoName: ["Eth", "Matic", "BTC", "USDC"],
    },
    {
        network: "polygonMumbai",
        tokens: [
            "",
            "0xBA47cF08bDFbA09E7732c0e48E12a11Cd1536bcd",
            "0xaDb88FCc910aBfb2c03B49EE2087e7D6C2Ddb2E9",
            "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747",
        ],
        cryptoName: ["Matic", "Eth", "BTC", "USDC"],
    },
]

const netWorthCalculator = async (username, privateKey) => {
    let prices = {}
    for (let i = 0; i < pricesRef.length; i++) {
        const fetchedPrices = await getPrices(
            pricesRef[i].tokens,
            pricesRef[i].network
        )
        if (fetchedPrices.success) {
            for (let j = 0; j < pricesRef[i].tokens.length; j++) {
                prices[pricesRef[i].cryptoName[j]] = Number(
                    ethers.utils.formatUnits(fetchedPrices.result[j], 8)
                )
            }
        } else {
            return { success: false, error: fetchedPrices.error }
        }
    }

    let wallets = []
    const getPrimaryWalletAddressResult = await getPrimaryWalletAddress(
        username
    )
    if (getPrimaryWalletAddressResult.success) {
        wallets.push(decrypt(privateKey, getPrimaryWalletAddressResult.result))
    } else {
        return { success: false, error: getPrimaryWalletAddressResult.error }
    }
    const getSecondaryWalletAddressesResult = await getSecondaryWalletAddresses(
        username
    )
    if (getSecondaryWalletAddressesResult.success) {
        for (
            let i = 0;
            i < getSecondaryWalletAddressesResult.result.length;
            i++
        ) {
            wallets.push(
                decrypt(privateKey, getSecondaryWalletAddressesResult.result[i])
            )
        }
    } else {
        return {
            success: false,
            error: getSecondaryWalletAddressesResult.error,
        }
    }

    let balances = {}
    for (let i = 0; i < wallets.length; i++) {
        for (let j = 0; j < balancesRef.length; j++) {
            const getNativeBalanceResult = await getNativeBalance(
                wallets[i],
                balancesRef[j].network
            )
            if (getNativeBalanceResult.success) {
                if (balancesRef[j].cryptoName[0] in balances) {
                    balances[balancesRef[j].cryptoName[0]] += Number(
                        ethers.utils.formatUnits(getNativeBalanceResult.result)
                    )
                } else {
                    balances[balancesRef[j].cryptoName[0]] = Number(
                        ethers.utils.formatUnits(getNativeBalanceResult.result)
                    )
                }
                const getBalancesResult = await getBalances(
                    wallets[i],
                    balancesRef[j].tokens.slice(1),
                    balancesRef[j].network
                )
                if (getBalancesResult.success) {
                    for (let k = 1; k < balancesRef[j].tokens.length; k++) {
                        if (balancesRef[j].cryptoName[k] in balances) {
                            balances[balancesRef[j].cryptoName[k]] += Number(
                                ethers.utils.formatUnits(
                                    getBalancesResult.result[k - 1]
                                )
                            )
                        } else {
                            balances[balancesRef[j].cryptoName[k]] = Number(
                                ethers.utils.formatUnits(
                                    getBalancesResult.result[k - 1]
                                )
                            )
                        }
                    }
                } else {
                    return {
                        success: false,
                        error: getBalancesResult.error,
                    }
                }
            } else {
                return {
                    success: false,
                    error: getNativeBalanceResult.error,
                }
            }
        }
    }

    let netWorth = 0

    for (const coin in balances) {
        netWorth += prices[coin] * balances[coin]
    }

    return { success: true, result: netWorth }
}

export { netWorthCalculator }
