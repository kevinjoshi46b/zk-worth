import express from "express"
import path from "path"
import { NODE_ENV, PORT } from "./env.js"
import authRoutes from './routes/authRoutes.js'
import walletsRoutes from './routes/walletsRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import requestsRoutes from './routes/requestsRoutes.js'

const app = express()

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/wallets', walletsRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use("/api/requests", requestsRoutes)

const __dirname = path.resolve()

if (NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/build")))
    app.get("*", (_, res) =>
        res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
    )
} else {
    app.get("/", (_, res) => {
        res.send("API is running...")
    })
}

app.listen(PORT, () =>
    console.log(`Server running in ${NODE_ENV} mode on http://localhost:${PORT}`)
)
