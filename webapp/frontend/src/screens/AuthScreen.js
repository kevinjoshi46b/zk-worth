import { useState, useEffect } from "react"
import logo from "../logo.png"
import Box from "@mui/material/Box"
import { Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import LoadingButton from "@mui/lab/LoadingButton"
import WalletRoundedIcon from "@mui/icons-material/WalletRounded"
import LoginIcon from "@mui/icons-material/Login"
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded"
import FileUploadIcon from "@mui/icons-material/FileUpload"
import CreateIcon from "@mui/icons-material/Create"
import TextField from "@mui/material/TextField"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import { shortner } from "../utils/walletAddressShortner"
import { useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie"
import axios from "axios"
import { useWeb3Modal } from "@web3modal/react"
import { useAccount, useSignMessage } from "wagmi"
import { ethers } from "ethers"

const AuthScreen = () => {
    const theme = useTheme()
    const { open } = useWeb3Modal()
    const { address } = useAccount()
    const navigate = useNavigate()
    const [cookies, setCookie, removeCookie] = useCookies([])
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
    const [snackbarSeverity, setSnackbarSeverity] = useState("error")
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState()
    const [passwordFileName, setPasswordFileName] = useState("")
    const [disableInput, setDisableInput] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const { data, signMessage } = useSignMessage({
        message: "authentication",
    })
    const [signedMessage, setSignedMessage] = useState(false)

    useEffect(() => {
        if (cookies.token) return navigate("/dashboard", { replace: true })
        if (cookies.snackbar) {
            setSnackbarSeverity(cookies.snackbar.snackbarSeverity)
            setSnackbarMessage(cookies.snackbar.snackbarMessage)
            setIsSnackbarOpen(true)
            removeCookie("snackbar", { path: "/" })
        }
    }, [])

    useEffect(() => {
        if (address == null || data == null) {
            setSignedMessage(false)
        } else {
            const signerAddress = ethers.utils.verifyMessage(
                "authentication",
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

    function uploadPasswordFile(event) {
        const fileNameSplit = event.target.files[0].name.split(".")
        if (fileNameSplit[fileNameSplit.length - 1] == "pem") {
            setPassword(event.target.files[0])
            setPasswordFileName(event.target.files[0].name)
        } else {
            setSnackbarSeverity("error")
            setSnackbarMessage(
                "Only .pem file can be uploaded! Make sure you are uploading the correct password file"
            )
            setIsSnackbarOpen(true)
        }
    }

    const authenticate = async () => {
        setDisableInput(true)
        setSubmitLoading(true)
        if (username == "") {
            setSnackbarSeverity("error")
            setSnackbarMessage("Username not provided!")
            setIsSnackbarOpen(true)
            setDisableInput(false)
            setSubmitLoading(false)
            return
        }
        if (password == undefined) {
            setSnackbarSeverity("error")
            setSnackbarMessage("Password file not provided!")
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
            url: "/api/auth",
            headers: {},
            data: {
                username,
                message: "authentication",
                signedMessage: data,
                primaryWalletAddress: address,
                password: await password.text(),
            },
        })
        if (!("error" in resp.data)) {
            setCookie("token", resp.data.token, {
                path: "/",
                maxAge: 86400,
            })
            setCookie("username", username, {
                path: "/",
                maxAge: 86400,
            })
            setCookie(
                "snackbar",
                {
                    snackbarSeverity: "success",
                    snackbarMessage: "Authenticated successfully!",
                },
                { path: "/" }
            )
            return navigate("/dashboard")
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
                {disableInput ? (
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
                <TextField
                    value={passwordFileName}
                    id="passwordFileName"
                    label="Password"
                    sx={{ width: "100%", mt: "20px" }}
                    disabled
                />
                <label htmlFor="password">
                    <input
                        style={{ display: "none" }}
                        id="password"
                        name="password"
                        type="file"
                        accept=".pem"
                        onChange={uploadPasswordFile}
                    />
                    {disableInput ? (
                        <LoadingButton
                            variant="outlined"
                            component="span"
                            sx={{
                                borderRadius: 2,
                                fontWeight: "bold",
                                width: "280px",
                                paddingY: "10px",
                                mt: "20px",
                            }}
                            startIcon={<FileUploadIcon />}
                            disabled
                        >
                            Upload Password
                        </LoadingButton>
                    ) : (
                        <LoadingButton
                            variant="outlined"
                            component="span"
                            sx={{
                                borderRadius: 2,
                                fontWeight: "bold",
                                width: "280px",
                                paddingY: "10px",
                                mt: "20px",
                            }}
                            startIcon={<FileUploadIcon />}
                        >
                            Upload Password
                        </LoadingButton>
                    )}
                </label>
                <TextField
                    value={address != undefined ? shortner(address) : ""}
                    id="walletAddress"
                    label="Wallet Address"
                    sx={{ width: "100%", mb: "20px", mt: "20px" }}
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
                <LoadingButton
                    onClick={() => authenticate()}
                    loading={submitLoading}
                    loadingPosition="start"
                    startIcon={<LoginIcon />}
                    variant="contained"
                    sx={{
                        borderRadius: 2,
                        fontWeight: "bold",
                        width: "280px",
                        paddingY: "10px",
                        mt: "20px",
                    }}
                >
                    Login
                </LoadingButton>
                <LoadingButton
                    color="secondary"
                    onClick={() => navigate("/signup")}
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

export default AuthScreen
