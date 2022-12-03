import jwt from "jsonwebtoken"
import { JWT_KEY } from "../env.js"

const generateToken = (username, privateKey, isAdmin) => {
    return jwt.sign({ username, privateKey, isAdmin }, JWT_KEY, {
        expiresIn: "1d",
    })
}

const verifyToken = (token) => {
    try {
        const result = jwt.verify(token, JWT_KEY)
        return { success: true, result }
    } catch (error) {
        return { success: false, error }
    }
}

export { generateToken, verifyToken }
