const NODE_ENV = process.env.NODE_ENV || "development"
const PORT = process.env.PORT || 5000
const ALCHEMY_GOERLI = process.env.ALCHEMY_GOERLI || ""
const ALCHEMY_POLYGONMUMBAI = process.env.ALCHEMY_POLYGONMUMBAI || ""
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || ""
const JWT_KEY = process.env.JWT_KEY || ""
const IPFS_TOKEN = process.env.IPFS_TOKEN || ""
const ADMIN_USERNAMES = process.env.ADMIN_USERNAMES
    ? JSON.parse(process.env.ADMIN_USERNAMES)
    : []

export {
    NODE_ENV,
    PORT,
    ALCHEMY_GOERLI,
    ALCHEMY_POLYGONMUMBAI,
    WALLET_PRIVATE_KEY,
    IPFS_TOKEN,
    JWT_KEY,
    ADMIN_USERNAMES,
}
