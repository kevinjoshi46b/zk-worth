import express from "express"
import path from "path"
import authRoutes from "./routes/authRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import walletsRoutes from "./routes/walletsRoutes.js"
import requestsRoutes from "./routes/requestsRoutes.js"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"
import { NODE_ENV, PORT } from "./env.js"

const app = express()

app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/wallets", walletsRoutes)
app.use("/api/requests", requestsRoutes)

const __dirname = path.resolve()

if (NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/build")))
    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
    )
} else {
    app.get("/", (req, res) => {
        res.send("API is running...")
    })
}

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () =>
    console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`)
)
