import {
    ALCHEMY_GOERLI,
    ALCHEMY_POLYGONMUMBAI,
    WALLET_PRIVATE_KEY,
    COV_API_KEY,
} from "../env.js"


const getPrice = (chainId, address) => {

    const url = new URL(`https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`);

    url.search = new URLSearchParams({
        key: COV_API_KEY
    })
    let res = {}
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
        const result = data.data;
        result.items.forEach(item => {
            if (item.contract_ticker_symbol in res){
                res[item.contract_ticker_symbol][0] += item.quote
                res[item.contract_ticker_symbol][1] += parseInt(item.balance) * 10**-18
            }
           res[item.contract_ticker_symbol] = [item.quote, parseInt(item.balance) * 10**-18] 
        });
        return res;
    })
}

export {
    getPrice,
};
