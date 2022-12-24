import expressAsyncHandler from "express-async-handler"
import { verifyToken } from "../utils/jwt.js"

const protect = expressAsyncHandler(async (req, res, next) => {
    let token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1]
        const tokenVerificationResult = verifyToken(token)
        if (tokenVerificationResult.success) {
            req.user = tokenVerificationResult.result
            next()
        } else {
            console.log(tokenVerificationResult.error)
            res.status(401)
            throw new Error("Not authorized, token failed")
        }
    }
    if (!token) {
        res.status(401)
        throw new Error("Not authorized, no token")
    }
})

const admin = (req, res, next) => {
    if (req.user && req.user.username && req.user.username.isAdmin) {
        next()
    } else {
        res.status(401)
        throw new Error("Not authorized as an admin")
    }
}

export { protect, admin }
