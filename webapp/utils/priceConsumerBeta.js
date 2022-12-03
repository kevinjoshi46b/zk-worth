import {
    ALCHEMY_GOERLI,
    ALCHEMY_POLYGONMUMBAI,
    WALLET_PRIVATE_KEY,
    COV_API_KEY,
} from "../env.js"

import axios from "axios"

const getPrice = () => {
    const chainId = '1'
    const address = '0xc3ef7bba19A079E226B9e0D8d91B95ee0a62dE49'
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
        console.log(parseInt(result.items[0].balance)*result.items[0].quote_rate)
        return result
    })
}

export {
    getPrice
};
