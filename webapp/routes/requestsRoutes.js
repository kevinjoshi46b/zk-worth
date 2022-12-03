import express from "express"
import {
    getIncomingRequestsController,
    updateRequestController,
    getOutgoingRequestsController,
    setRequestController,
} from "../controllers/requestsControllers.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router
    .route("/incoming")
    .get(protect, getIncomingRequestsController)
    .post(protect, updateRequestController)
router
    .route("/outgoing")
    .get(protect, getOutgoingRequestsController)
    .post(protect, setRequestController)

export default router
