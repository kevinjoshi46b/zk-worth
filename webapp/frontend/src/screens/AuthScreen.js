import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import { Typography } from "@mui/material"
import { useWeb3Modal } from "@web3modal/react"
import { useAccount } from "wagmi"
import { useTheme } from "@mui/material/styles"
import LoadingButton from "@mui/lab/LoadingButton"
import WalletRoundedIcon from "@mui/icons-material/WalletRounded"
import logo from "../logo.png"
import { useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie"
import axios from "axios"

const AuthScreen = () => {
    const theme = useTheme()
    const { isOpen, open } = useWeb3Modal()
    const { address, isConnecting, isConnected } = useAccount()
    const navigate = useNavigate()
    const [cookies, setCookie] = useCookies([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (cookies.Auth) return navigate("/dashboard", { replace: true })
    }, [])

    const authenticate = async () => {
        let resp = await axios({
            method: "post",
            url: "/api/auth",
            headers: {},
            data: {
                walletAddress: address,
            },
        })
        if (resp.data.exists) {
            setCookie(
                "Auth",
                JSON.stringify({
                    username: resp.data.username,
                    walletAddress: resp.data.walletAddress,
                }),
                {
                    path: "/",
                }
            )
            return navigate("/dashboard", { replace: true })
        } else {
            return navigate("/signup", { replace: true })
        }
    }

    useEffect(() => {
        if (isConnecting) {
            if (!isOpen) {
                setIsLoading(false)
            } else {
                setIsLoading(true)
            }
        } else {
            if (isConnected) {
                setIsLoading(true)
                authenticate()
            } else {
                setIsLoading(false)
            }
        }
    }, [isConnected, isConnecting, isOpen])

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: "100px",
            }}
        >
            <Box
                sx={{ display: "flex", flexDirection: "row", mb: "120px" }}
                alignItems="center"
            >
                <img
                    src={logo}
                    alt="Logo"
                    style={{
                        width: 50,
                        height: 50,
                        display: "block",
                    }}
                />
                <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", mx: "10px" }}
                >
                    KryptoAssetZ
                </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: "30px" }}>
                AUTHENTICATION
            </Typography>
            <Box
                sx={{
                    width: "320px",
                    backgroundColor:
                        theme.palette.mode === "dark" ? "#1E1E1E" : "#F5F5F5",
                    borderRadius: 4,
                    padding: "20px",
                }}
            >
                <LoadingButton
                    color="primary"
                    onClick={() => {
                        setIsLoading(true)
                        open()
                    }}
                    loading={isLoading}
                    loadingPosition="start"
                    startIcon={<WalletRoundedIcon />}
                    variant="contained"
                    sx={{
                        borderRadius: 2,
                        fontWeight: "bold",
                        width: "280px",
                        paddingY: "10px",
                    }}
                >
                    Connect Wallet
                </LoadingButton>
            </Box>
        </Box>
    )
}

export default AuthScreen
