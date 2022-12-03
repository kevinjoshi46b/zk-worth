import { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import { Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import LoadingButton from "@mui/lab/LoadingButton"
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded"
import TextField from "@mui/material/TextField"
import logo from "../logo.png"
import { useAccount } from "wagmi"
import { useNavigate } from "react-router-dom"
import { shortner } from "../utils/walletAddressShortner"
import { useCookies } from "react-cookie"
import axios from "axios"

const SignupScreen = () => {
    const theme = useTheme()
    const { address, isConnected } = useAccount()
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [cookies, setCookie] = useCookies([])

    useEffect(() => {
        if (cookies.Auth) return navigate("/dashboard", { replace: true })
    }, [])

    useEffect(() => {
        if (!isConnected) {
            return navigate("/", { replace: true })
        }
    }, [isConnected])

    const [isUniqueUsername, setIsUniqueUsername] = useState(true)
    const [disableInput, setDisableInput] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)

    const createAccount = async () => {
        setSubmitLoading(true)
        setDisableInput(true)
        let resp = await axios({
            method: "post",
            url: "/api/auth/createaccount",
            headers: {},
            data: {
                username: username,
                walletAddress: address,
            },
        })
        if (resp.data.isUnique) {
            if (resp.data.success) {
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
                navigate("/dashboard", { replace: true })
            }
        } else {
            setDisableInput(false)
            setSubmitLoading(false)
            setIsUniqueUsername(false)
        }
    }

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
                SIGNUP
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
                {disableInput ? (
                    <TextField
                        value={username}
                        id="username"
                        label="Username"
                        sx={{ width: "100%" }}
                        disabled
                    />
                ) : isUniqueUsername ? (
                    <TextField
                        value={username}
                        id="username"
                        label="Username"
                        sx={{ width: "100%" }}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                ) : (
                    <TextField
                        error
                        value={username}
                        id="username"
                        label="Username"
                        sx={{ width: "100%" }}
                        onChange={(e) => setUsername(e.target.value)}
                        helperText="Username is already used!"
                    />
                )}
                <TextField
                    value={address != undefined ? shortner(address) : ""}
                    id="walletAddress"
                    label="Wallet Address"
                    sx={{ width: "100%", mb: "34px", mt: "20px" }}
                    disabled
                />
                <LoadingButton
                    color="primary"
                    onClick={() => createAccount()}
                    loading={submitLoading}
                    loadingPosition="start"
                    startIcon={<AddBoxRoundedIcon />}
                    variant="contained"
                    sx={{
                        borderRadius: 2,
                        fontWeight: "bold",
                        width: "280px",
                        paddingY: "10px",
                    }}
                >
                    Create Account
                </LoadingButton>
            </Box>
        </Box>
    )
}

export default SignupScreen
