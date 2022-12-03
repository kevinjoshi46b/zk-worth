import {
    ALCHEMY_GOERLI,
    ALCHEMY_POLYGONMUMBAI,
    WALLET_PRIVATE_KEY,
    COV_API_KEY,
} from "../env.js"


const getPrice = (token, network, address) => {

    const chainId = '80001'
    const url = new URL(`https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`);

    url.search = new URLSearchParams({
        key: COV_API_KEY
    })
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
        const result = data.data;
        console.log(result)
        console.log(parseInt(result.items[0].balance))
        console.log(parseInt(result.items[0].balance)*result.items[0].quote_rate*10**-18)
        return result
    })
}

// console.log(getPrice("0xBA47cF08bDFbA09E7732c0e48E12a11Cd1536bcd", "polygonMumbai", "0xc3ef7bba19A079E226B9e0D8d91B95ee0a62dE49"))

export {
    getPrice
};

