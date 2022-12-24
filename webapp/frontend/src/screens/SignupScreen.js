import { useEffect, useState } from "react"
import logo from "../logo.png"
import Box from "@mui/material/Box"
import { Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import TextField from "@mui/material/TextField"
import LoadingButton from "@mui/lab/LoadingButton"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import WalletRoundedIcon from "@mui/icons-material/WalletRounded"
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded"
import CreateIcon from "@mui/icons-material/Create"
import { useWeb3Modal } from "@web3modal/react"
import { useAccount, useSignMessage } from "wagmi"
import { useNavigate } from "react-router-dom"
import { shortner } from "../utils/walletAddressShortner"
import { useCookies } from "react-cookie"
import axios from "axios"
import { ethers } from "ethers"
import zKWorthPolygonMumbai from "../contracts/zKWorthPolygonMumbai.json"

const SignupScreen = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const [cookies, setCookie] = useCookies([])
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
    const [snackbarSeverity, setSnackbarSeverity] = useState("success")
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [username, setUsername] = useState("")
    const { open } = useWeb3Modal()
    const { address } = useAccount()
    const [disableInput, setDisableInput] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [isUniqueUsernameLoading, setIsUniqueUsernameLoading] =
        useState(false)
    const { data, signMessage } = useSignMessage({
        message: "create account",
    })
    const [signedMessage, setSignedMessage] = useState(false)

    useEffect(() => {
        if (cookies.token) return navigate("/dashboard", { replace: true })
    }, [])

    useEffect(() => {
        if (address == null || data == null) {
            setSignedMessage(false)
        } else {
            const signerAddress = ethers.utils.verifyMessage(
                "create account",
                data
            )
            if (signerAddress == address) {
                setSignedMessage(true)
            } else {
                setSignedMessage(false)
            }
        }
    }, [data, address])

    const closeSnackBar = () => {
        setIsSnackbarOpen(false)
    }

    const signMessageFunc = () => {
        if (address == undefined) {
            setSnackbarSeverity("error")
            setSnackbarMessage("Wallet not connected!")
            setIsSnackbarOpen(true)
            setSubmitLoading(false)
            return
        }
        signMessage()
    }

    const checkUniquiness = async () => {
        setIsUniqueUsernameLoading(true)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const providerContract = new ethers.Contract(
            zKWorthPolygonMumbai.address,
            zKWorthPolygonMumbai.abi,
            provider
        )
        const result = await providerContract.isUniqueUsername(username)
        if (!result) {
            setSnackbarSeverity("error")
            setSnackbarMessage("Username is already used!")
        } else {
            setSnackbarSeverity("success")
            setSnackbarMessage("Username is unique!")
        }
        setIsSnackbarOpen(true)
        setIsUniqueUsernameLoading(false)
    }

    const createAccount = async () => {
        setSubmitLoading(true)
        setDisableInput(true)
        if (username == "") {
            setSnackbarSeverity("error")
            setSnackbarMessage("Username not provided!")
            setIsSnackbarOpen(true)
            setDisableInput(false)
            setSubmitLoading(false)
            return
        }
        if (address == undefined) {
            setSnackbarSeverity("error")
            setSnackbarMessage("Wallet not connected!")
            setIsSnackbarOpen(true)
            setDisableInput(false)
            setSubmitLoading(false)
            return
        }
        if (data == undefined || !signedMessage) {
            setSnackbarSeverity("error")
            setSnackbarMessage("Message not signed!")
            setIsSnackbarOpen(true)
            setSubmitLoading(false)
            return
        }
        const resp = await axios({
            method: "post",
            url: "/api/auth/signup",
            headers: {},
            data: {
                username: username,
                message: "create account",
                signedMessage: data,
                primaryWalletAddress: address,
            },
        })
        if (!("error" in resp.data)) {
            setIsSnackbarOpen(true)
            const element = document.createElement("a")
            const file = new Blob([resp.data.password], {
                type: "text/plain",
            })
            element.href = URL.createObjectURL(file)
            element.download = "Password_ZKWorth.pem"
            document.body.appendChild(element)
            element.click()
            URL.revokeObjectURL(element.href)
            element.remove()
            setCookie(
                "snackbar",
                {
                    snackbarSeverity: "success",
                    snackbarMessage:
                        "Registered successfully! Make sure you backup the password file",
                },
                { path: "/" }
            )
            navigate("/")
        } else {
            setSnackbarSeverity("error")
            setSnackbarMessage(
                (resp.data.error ? resp.data.error : "") +
                    ": " +
                    (resp.data.message ? resp.data.message : "")
            )
            setIsSnackbarOpen(true)
            setDisableInput(false)
            setSubmitLoading(false)
        }
    }
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: "80px",
                mb: "40px",
            }}
        >
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={isSnackbarOpen}
                onClose={closeSnackBar}
                autoHideDuration={6000}
            >
                <Alert
                    onClose={closeSnackBar}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage ? snackbarMessage : ""}
                </Alert>
            </Snackbar>
            <Box
                sx={{ display: "flex", flexDirection: "row", mb: "80px" }}
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
                    ZK Worth
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
                <TextField
                    value={address != undefined ? shortner(address) : ""}
                    id="walletAddress"
                    label="Wallet Address"
                    sx={{ width: "100%", mb: "20px" }}
                    disabled
                />
                {disableInput ? (
                    <LoadingButton
                        startIcon={<WalletRoundedIcon />}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            fontWeight: "bold",
                            width: "280px",
                            paddingY: "10px",
                            mb: "20px",
                        }}
                        disabled
                    >
                        Connect Wallet
                    </LoadingButton>
                ) : (
                    <LoadingButton
                        onClick={() => {
                            open()
                        }}
                        loadingPosition="start"
                        startIcon={<WalletRoundedIcon />}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            fontWeight: "bold",
                            width: "280px",
                            paddingY: "10px",
                            mb: "20px",
                        }}
                    >
                        Connect Wallet
                    </LoadingButton>
                )}
                <Typography
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        mb: "20px",
                    }}
                >
                    Message Signed:
                    {signedMessage ? (
                        <Typography sx={{ color: "green", ml: "6px" }}>
                            YES
                        </Typography>
                    ) : (
                        <Typography sx={{ color: "red", ml: "6px" }}>
                            NO
                        </Typography>
                    )}
                </Typography>
                {disableInput ? (
                    <LoadingButton
                        startIcon={<CreateIcon />}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            fontWeight: "bold",
                            width: "280px",
                            paddingY: "10px",
                            mb: "20px",
                        }}
                        disabled
                    >
                        Sign Message
                    </LoadingButton>
                ) : (
                    <LoadingButton
                        onClick={() => {
                            signMessageFunc()
                        }}
                        loadingPosition="start"
                        startIcon={<CreateIcon />}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            fontWeight: "bold",
                            width: "280px",
                            paddingY: "10px",
                            mb: "20px",
                        }}
                    >
                        Sign Message
                    </LoadingButton>
                )}
                {isUniqueUsernameLoading || disableInput ? (
                    <TextField
                        value={username}
                        id="username"
                        label="Username"
                        sx={{ width: "100%" }}
                        disabled
                    />
                ) : (
                    <TextField
                        value={username}
                        id="username"
                        label="Username"
                        sx={{ width: "100%" }}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                )}
                {disableInput ? (
                    <LoadingButton
                        startIcon={<CheckCircleIcon />}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            fontWeight: "bold",
                            width: "280px",
                            paddingY: "10px",
                            mt: "20px",
                            mb: "20px",
                        }}
                        disabled
                    >
                        Check Username Uniqueness
                    </LoadingButton>
                ) : (
                    <LoadingButton
                        onClick={() => checkUniquiness()}
                        loading={isUniqueUsernameLoading}
                        loadingPosition="start"
                        startIcon={<CheckCircleIcon />}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            fontWeight: "bold",
                            width: "280px",
                            paddingY: "10px",
                            mt: "20px",
                            mb: "20px",
                        }}
                    >
                        Check Username Uniqueness
                    </LoadingButton>
                )}
                <LoadingButton
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
                        mt: "20px",
                    }}
                >
                    Signup
                </LoadingButton>
            </Box>
        </Box>
    )
}

export default SignupScreen
