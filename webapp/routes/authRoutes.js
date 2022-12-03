import express from "express"
import { login, signup } from "../controllers/authControllers.js"

const router = express.Router()

router.route("/").post(login)
router.route("/signup").post(signup)

export default router
