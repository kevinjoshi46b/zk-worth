const NODE_ENV = process.env.NODE_ENV || "development"
const PORT = process.env.PORT || 2000
const ALCHEMY_GOERLI = process.env.ALCHEMY_GOERLI || ""
const ALCHEMY_POLYGONMUMBAI = process.env.ALCHEMY_POLYGONMUMBAI || ""
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || ""

export {
    NODE_ENV,
    PORT,
    ALCHEMY_GOERLI,
    ALCHEMY_POLYGONMUMBAI,
    WALLET_PRIVATE_KEY,
}
