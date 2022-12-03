import express from "express"
import {
    getWalletAddressesController,
    setSecondaryWalletAddressController,
    removeSecondaryWalletAddressController,
} from "../controllers/walletsControllers.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router
    .route("/")
    .get(protect, getWalletAddressesController)
    .post(protect, setSecondaryWalletAddressController)
    .delete(protect, removeSecondaryWalletAddressController)

export default router
