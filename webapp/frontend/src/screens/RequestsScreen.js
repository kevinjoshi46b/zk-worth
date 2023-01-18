import { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import { Typography } from "@mui/material"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import { useTheme } from "@mui/material/styles"
import CloseIcon from "@mui/icons-material/Close"
import Button from "@mui/material/Button"
import DoneIcon from "@mui/icons-material/Done"
import SendIcon from "@mui/icons-material/Send"
import DownloadIcon from "@mui/icons-material/Download"
import PropTypes from "prop-types"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import SouthWestIcon from "@mui/icons-material/SouthWest"
import NorthEastIcon from "@mui/icons-material/NorthEast"
import Skeleton from "@mui/material/Skeleton"
import Drawer from "../components/Drawer"
import Topbar from "../components/Topbar"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import { useCookies } from "react-cookie"
import axios from "axios"
import Modal from "@mui/material/Modal"
import TextField from "@mui/material/TextField"
import LoadingButton from "@mui/lab/LoadingButton"
import { ethers } from "ethers"
import zKWorthPolygonMumbai from "../contracts/zKWorthPolygonMumbai.json"

const TabPanel = (props) => {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
}

const a11yProps = (index) => {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    }
}

const RequestsScreen = ({ drawerWidth }) => {
    const theme = useTheme()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
    const [snackbarSeverity, setSnackbarSeverity] = useState("success")
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [cookies, setCookie, removeCookie] = useCookies([])
    const [tabValue, setTabValue] = useState(0)
    const [page1, setPage1] = useState(0)
    const [rowsPerPage1, setRowsPerPage1] = useState(5)
    const [page2, setPage2] = useState(0)
    const [rowsPerPage2, setRowsPerPage2] = useState(5)
    const [page3, setPage3] = useState(0)
    const [rowsPerPage3, setRowsPerPage3] = useState(5)
    const [pendingData, setPendingData] = useState(null)
    const [historyData, setHistoryData] = useState(null)
    const [outgoingData, setOutgoingData] = useState(null)
    const columns1 = [
        { id: "username", label: "Username" },
        { id: "threshold", label: "Threshold Amount (in $)" },
        { id: "action", label: "", align: "right" },
    ]
    const columns2 = [
        { id: "username", label: "Username" },
        { id: "threshold", label: "Threshold Amount (in $)" },
        { id: "action", label: "Action Taken" },
        { id: "response", label: "Response" },
    ]
    const columns3 = [
        { id: "username", label: "Username" },
        { id: "threshold", label: "Threshold Amount (in $)" },
        { id: "status", label: "Status" },
        { id: "result", label: "Result" },
        { id: "proof", label: "", align: "right" },
    ]
    const [openModal, setOpenModal] = useState(false)
    const [sRUsername, setSRUsername] = useState("")
    const [sRThreshold, setSRThreshold] = useState("")
    const [submitLoading, setSubmitLoading] = useState(false)

    useEffect(() => {
        if (cookies.snackbar) {
            setSnackbarSeverity(cookies.snackbar.snackbarSeverity)
            setSnackbarMessage(cookies.snackbar.snackbarMessage)
            setIsSnackbarOpen(true)
            removeCookie("snackbar", { path: "/" })
        }
        const innerFunction = async () => {
            try {
                const incomingRequestsResp = await axios({
                    method: "get",
                    url: "/api/requests/incoming",
                    headers: {
                        Authorization: "Bearer " + cookies.token,
                    },
                })
                if (!("error" in incomingRequestsResp.data)) {
                    setPendingData(incomingRequestsResp.data.data[0])
                    setHistoryData(incomingRequestsResp.data.data[1])
                    setSnackbarSeverity("success")
                    setSnackbarMessage(
                        "Incoming requests data fetched successfully!"
                    )
                } else {
                    setSnackbarSeverity("error")
                    setSnackbarMessage(
                        "Oops something went wrong in fetching incoming requests data! Please reload"
                    )
                }
            } catch (error) {
                setSnackbarSeverity("error")
                setSnackbarMessage(
                    "Oops something went wrong in fetching incoming requests data! Please reload"
                )
            }
            setIsSnackbarOpen(true)
        }
        innerFunction()
    }, [])

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const handleChangeTab = async (event, newTabValue) => {
        setTabValue(newTabValue)
        if (newTabValue == 0) {
            setPendingData(null)
            setHistoryData(null)
            try {
                const incomingRequestsResp = await axios({
                    method: "get",
                    url: "/api/requests/incoming",
                    headers: {
                        Authorization: "Bearer " + cookies.token,
                    },
                })
                if (!("error" in incomingRequestsResp.data)) {
                    setPendingData(incomingRequestsResp.data.data[0])
                    setHistoryData(incomingRequestsResp.data.data[1])
                    setSnackbarSeverity("success")
                    setSnackbarMessage(
                        "Incoming requests data fetched successfully!"
                    )
                } else {
                    setSnackbarSeverity("error")
                    setSnackbarMessage(
                        "Oops something went wrong in fetching incoming requests data! Please reload"
                    )
                }
            } catch (error) {
                setSnackbarSeverity("error")
                setSnackbarMessage(
                    "Oops something went wrong in fetching incoming requests data! Please reload"
                )
            }
        } else if (newTabValue == 1) {
            setOutgoingData(null)
            try {
                const incomingRequestsResp = await axios({
                    method: "get",
                    url: "/api/requests/outgoing",
                    headers: {
                        Authorization: "Bearer " + cookies.token,
                    },
                })
                if (!("error" in incomingRequestsResp.data)) {
                    setOutgoingData(incomingRequestsResp.data.data)
                    setSnackbarSeverity("success")
                    setSnackbarMessage(
                        "Outgoing requests data fetched successfully!"
                    )
                } else {
                    setSnackbarSeverity("error")
                    setSnackbarMessage(
                        "Oops something went wrong in fetching outgoing requests data! Please reload"
                    )
                }
            } catch (error) {
                setSnackbarSeverity("error")
                setSnackbarMessage(
                    "Oops something went wrong in fetching outgoing requests data! Please reload"
                )
            }
        }
        setIsSnackbarOpen(true)
    }

    const handleChangePage1 = (event, newPage) => {
        setPage1(newPage)
    }

    const handleChangeRowsPerPage1 = (event) => {
        setRowsPerPage1(+event.target.value)
        setPage1(0)
    }

    const handleChangePage2 = (event, newPage) => {
        setPage2(newPage)
    }

    const handleChangeRowsPerPage2 = (event) => {
        setRowsPerPage2(+event.target.value)
        setPage2(0)
    }

    const handleChangePage3 = (event, newPage) => {
        setPage3(newPage)
    }

    const handleChangeRowsPerPage3 = (event) => {
        setRowsPerPage3(+event.target.value)
        setPage3(0)
    }

    const closeSnackBar = () => {
        setIsSnackbarOpen(false)
    }

    const sendRequest = async () => {
        setSubmitLoading(true)
        if (sRUsername == "") {
            setSnackbarSeverity("error")
            setSnackbarMessage("Username not provided!")
            setIsSnackbarOpen(true)
            setSubmitLoading(false)
            return
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const providerContract = new ethers.Contract(
            zKWorthPolygonMumbai.address,
            zKWorthPolygonMumbai.abi,
            provider
        )
        if (await providerContract.isUniqueUsername(sRUsername)) {
            setSnackbarSeverity("error")
            setSnackbarMessage("Provided username doesn't exist!")
            setIsSnackbarOpen(true)
            setSubmitLoading(false)
            return
        }
        for (let i = 0; i < outgoingData.length; i++) {
            if (
                outgoingData[i].username == sRUsername &&
                outgoingData[i].status == "Pending"
            ) {
                setSnackbarSeverity("error")
                setSnackbarMessage(
                    "A request with a pending response has already been sent to the user!"
                )
                setIsSnackbarOpen(true)
                setSubmitLoading(false)
                return
            }
        }
        if (
            isNaN(Number(sRThreshold)) ||
            !Number.isInteger(Number(sRThreshold))
        ) {
            setSnackbarSeverity("error")
            setSnackbarMessage("Threshold amount is not an integer!")
            setIsSnackbarOpen(true)
            setSubmitLoading(false)
            return
        }
        if (Number(sRThreshold) < 0) {
            setSnackbarSeverity("error")
            setSnackbarMessage("Threshold amount cannot be negative!")
            setIsSnackbarOpen(true)
            setSubmitLoading(false)
            return
        }
        try {
            const resp = await axios({
                method: "post",
                url: "/api/requests/outgoing",
                headers: { Authorization: "Bearer " + cookies.token },
                data: {
                    receiver: sRUsername,
                    threshold: sRThreshold,
                },
            })
            if (!("error" in resp.data)) {
                let newOutgoingData = outgoingData
                newOutgoingData.reverse()
                newOutgoingData.push({
                    username: sRUsername,
                    threshold: sRThreshold,
                    status: "Pending",
                    result: "-",
                    cid: "",
                    isLoading: false,
                })
                newOutgoingData.reverse()
                setOutgoingData(newOutgoingData)
                setSRUsername("")
                setSRThreshold("")
                setSnackbarSeverity("success")
                setSnackbarMessage(resp.data.message)
                setOpenModal(false)
            } else {
                setSnackbarSeverity("error")
                setSnackbarMessage(
                    (resp.data.error ? resp.data.error : "") +
                        ": " +
                        (resp.data.message ? resp.data.message : "")
                )
            }
            setIsSnackbarOpen(true)
            setSubmitLoading(false)
        } catch (error) {
            setSnackbarSeverity("error")
            setSnackbarMessage(
                "Oops something went wrong in sending request! Please try again"
            )
            setIsSnackbarOpen(true)
            setSubmitLoading(false)
        }
    }

    const updateRequest = async (id, sender, status, threshold) => {
        let newPendingData = pendingData
        for (let i = 0; i < newPendingData.length; i++) {
            if (newPendingData[i].id == id) {
                newPendingData[i].isLoading = true
            }
        }
        setPendingData(newPendingData)
        try {
            const resp = await axios({
                method: "post",
                url: "/api/requests/incoming",
                headers: { Authorization: "Bearer " + cookies.token },
                data: {
                    id,
                    sender,
                    status,
                },
            })
            if (!("error" in resp.data)) {
                newPendingData = []
                for (let i = 0; i < pendingData.length; i++) {
                    if (pendingData[i].id != id) {
                        newPendingData.push(pendingData[i])
                    }
                }
                setPendingData(newPendingData)
                const updatedData = {
                    id,
                    username: sender,
                    threshold,
                    action: status == 1 ? "Accepted" : "Rejected",
                    response:
                        status == 1
                            ? resp.data.data == 1
                                ? "Net worth is equal to or above threshold amount"
                                : "Net worth is below threshold amount"
                            : "-",
                }
                let pushed = false
                let newHistoryData = []
                for (let i = 0; i < historyData.length; i++) {
                    if (!pushed && id > historyData[i].id) {
                        pushed = true
                        newHistoryData.push(updatedData)
                    }
                    newHistoryData.push(historyData[i])
                }
                if (!pushed) {
                    newHistoryData.push(updatedData)
                }
                setHistoryData(newHistoryData)
                setSnackbarSeverity("success")
                setSnackbarMessage(resp.data.message)
            } else {
                setSnackbarSeverity("error")
                setSnackbarMessage(
                    (resp.data.error ? resp.data.error : "") +
                        ": " +
                        (resp.data.message ? resp.data.message : "")
                )
                for (let i = 0; i < newPendingData.length; i++) {
                    if (newPendingData[i].id == id) {
                        newPendingData[i].isLoading = false
                    }
                }
                setPendingData(newPendingData)
            }
            setIsSnackbarOpen(true)
        } catch (error) {
            setSnackbarSeverity("error")
            setSnackbarMessage(
                "Oops something went wrong in updating request! Please try again"
            )
            for (let i = 0; i < newPendingData.length; i++) {
                if (newPendingData[i].id == id) {
                    newPendingData[i].isLoading = false
                }
            }
            setPendingData(newPendingData)
            setIsSnackbarOpen(true)
        }
    }

    const downloadProof = async (cid) => {
        let newOutgoingData = outgoingData
        for (let i = 0; i < newOutgoingData.length; i++) {
            if (newOutgoingData[i].cid == cid) {
                newOutgoingData[i].isLoading = true
            }
        }
        setOutgoingData(newOutgoingData)
        try {
            const resp = await axios({
                method: "get",
                url: "https://" + cid + ".ipfs.w3s.link/proof.txt",
            })
            const element = document.createElement("a")
            const file = new Blob([resp.data], {
                type: "text/plain",
            })
            element.href = URL.createObjectURL(file)
            element.download = "Proof_" + cid + ".txt"
            document.body.appendChild(element)
            element.click()
            URL.revokeObjectURL(element.href)
            element.remove()
            setSnackbarSeverity("success")
            setSnackbarMessage("Proof downloading successfully!")
        } catch (error) {
            setSnackbarSeverity("error")
            setSnackbarMessage(
                "Oops something went wrong in downloading proof! Please try again"
            )
        }
        setIsSnackbarOpen(true)
        for (let i = 0; i < newOutgoingData.length; i++) {
            if (newOutgoingData[i].cid == cid) {
                newOutgoingData[i].isLoading = false
            }
        }
        setOutgoingData(newOutgoingData)
    }

    return (
        <Box>
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={isSnackbarOpen}
                onClose={closeSnackBar}
                autoHideDuration={6000}
            >
                <Alert
                    onClose={closeSnackBar}
                    severity={snackbarSeverity ? snackbarSeverity : ""}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage ? snackbarMessage : ""}
                </Alert>
            </Snackbar>

            {/* Top Bar */}
            <Topbar
                pageType="Requests"
                drawerWidth={drawerWidth}
                handleDrawerToggle={handleDrawerToggle}
            />

            {/* Drawer */}
            <Drawer
                drawerWidth={drawerWidth}
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
                pageType="Requests"
            />

            {/* Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    pl: { xs: "20px", sm: `calc(${drawerWidth}px + 48px)` },
                    pt: { xs: "86px", sm: "118px" },
                    pr: { xs: "20px", sm: "48px" },
                    pb: { xs: "32px", sm: "48px" },
                }}
            >
                <Box sx={{ width: "100%" }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs value={tabValue} onChange={handleChangeTab}>
                            <Tab
                                label={
                                    <Box
                                        sx={{ display: "flex" }}
                                        alignItems="center"
                                    >
                                        {" "}
                                        <SouthWestIcon
                                            sx={{ mr: "8px" }}
                                        />{" "}
                                        Incoming
                                    </Box>
                                }
                                {...a11yProps(0)}
                            />
                            <Tab
                                label={
                                    <Box
                                        sx={{ display: "flex" }}
                                        alignItems="center"
                                    >
                                        {" "}
                                        <NorthEastIcon
                                            sx={{ mr: "8px" }}
                                        />{" "}
                                        Outgoing
                                    </Box>
                                }
                                {...a11yProps(1)}
                            />
                        </Tabs>
                    </Box>
                    <TabPanel value={tabValue} index={0}>
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: "bold", mt: "24px", ml: "10px" }}
                        >
                            Pending
                        </Typography>
                        <Box
                            sx={{
                                mt: "10px",
                                width: "100%",
                                backgroundColor:
                                    theme.palette.mode === "dark"
                                        ? "#1E1E1E"
                                        : "#F5F5F5",
                                borderRadius: 4,
                                padding: "20px",
                                pb: "6px",
                            }}
                        >
                            {pendingData == null ? (
                                <>
                                    <TableContainer
                                        sx={{
                                            borderTopLeftRadius: 12,
                                            borderTopRightRadius: 12,
                                        }}
                                    >
                                        <Table
                                            stickyHeader
                                            aria-label="sticky table"
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    {columns1.map(
                                                        (column, index) => (
                                                            <TableCell
                                                                key={index}
                                                                align={
                                                                    column.align
                                                                }
                                                            >
                                                                {column.label}
                                                            </TableCell>
                                                        )
                                                    )}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={140}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={140}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button
                                                            sx={{
                                                                p: 0,
                                                                cursor: "default",
                                                                "&.MuiButtonBase-root:hover":
                                                                    {
                                                                        bgcolor:
                                                                            "transparent",
                                                                    },
                                                                mr: "6px",
                                                            }}
                                                        >
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={100}
                                                                height={40}
                                                            />
                                                        </Button>
                                                        <Button
                                                            sx={{
                                                                p: 0,
                                                                cursor: "default",
                                                                "&.MuiButtonBase-root:hover":
                                                                    {
                                                                        bgcolor:
                                                                            "transparent",
                                                                    },
                                                            }}
                                                        >
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={100}
                                                                height={40}
                                                            />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={140}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={140}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button
                                                            sx={{
                                                                p: 0,
                                                                cursor: "default",
                                                                "&.MuiButtonBase-root:hover":
                                                                    {
                                                                        bgcolor:
                                                                            "transparent",
                                                                    },
                                                                mr: "6px",
                                                            }}
                                                        >
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={100}
                                                                height={40}
                                                            />
                                                        </Button>
                                                        <Button
                                                            sx={{
                                                                p: 0,
                                                                cursor: "default",
                                                                "&.MuiButtonBase-root:hover":
                                                                    {
                                                                        bgcolor:
                                                                            "transparent",
                                                                    },
                                                            }}
                                                        >
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={100}
                                                                height={40}
                                                            />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={140}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={140}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent:
                                                                    "end",
                                                            }}
                                                        >
                                                            <Button
                                                                sx={{
                                                                    p: 0,
                                                                    cursor: "default",
                                                                    "&.MuiButtonBase-root:hover":
                                                                        {
                                                                            bgcolor:
                                                                                "transparent",
                                                                        },
                                                                    mr: "6px",
                                                                }}
                                                            >
                                                                <Skeleton
                                                                    variant="rounded"
                                                                    width={100}
                                                                    height={40}
                                                                />
                                                            </Button>
                                                            <Button
                                                                sx={{
                                                                    p: 0,
                                                                    cursor: "default",
                                                                    "&.MuiButtonBase-root:hover":
                                                                        {
                                                                            bgcolor:
                                                                                "transparent",
                                                                        },
                                                                }}
                                                            >
                                                                <Skeleton
                                                                    variant="rounded"
                                                                    width={100}
                                                                    height={40}
                                                                />
                                                            </Button>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Box
                                        sx={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "end",
                                        }}
                                    >
                                        <Skeleton
                                            variant="rounded"
                                            width={300}
                                            height={30}
                                            sx={{
                                                mt: "14px",
                                                mr: "18px",
                                                mb: "16px",
                                            }}
                                        />
                                    </Box>
                                </>
                            ) : pendingData.length == 0 ? (
                                <>
                                    <TableContainer
                                        sx={{
                                            borderTopLeftRadius: 12,
                                            borderTopRightRadius: 12,
                                        }}
                                    >
                                        <Table
                                            stickyHeader
                                            aria-label="sticky table"
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    {columns1.map(
                                                        (column, index) => (
                                                            <TableCell
                                                                key={index}
                                                                align={
                                                                    column.align
                                                                }
                                                            >
                                                                {column.label}
                                                            </TableCell>
                                                        )
                                                    )}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody></TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            p: "20px",
                                        }}
                                    >
                                        <Typography variant="h6">
                                            No Requests Pending
                                        </Typography>
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <TableContainer
                                        sx={{
                                            borderTopLeftRadius: 12,
                                            borderTopRightRadius: 12,
                                        }}
                                    >
                                        <Table
                                            stickyHeader
                                            aria-label="sticky table"
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    {columns1.map(
                                                        (column, index) => (
                                                            <TableCell
                                                                key={index}
                                                                align={
                                                                    column.align
                                                                }
                                                            >
                                                                {column.label}
                                                            </TableCell>
                                                        )
                                                    )}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {pendingData
                                                    .slice(
                                                        page1 * rowsPerPage1,
                                                        page1 * rowsPerPage1 +
                                                            rowsPerPage1
                                                    )
                                                    .map((row, index) => {
                                                        return (
                                                            <TableRow
                                                                hover
                                                                key={index}
                                                            >
                                                                {columns1.map(
                                                                    (
                                                                        column,
                                                                        index
                                                                    ) => {
                                                                        const value =
                                                                            row[
                                                                                column
                                                                                    .id
                                                                            ]
                                                                        return (
                                                                            <TableCell
                                                                                key={
                                                                                    index
                                                                                }
                                                                                align={
                                                                                    column.align
                                                                                }
                                                                            >
                                                                                {column.id ==
                                                                                "threshold"
                                                                                    ? Number(
                                                                                          value
                                                                                      ).toLocaleString()
                                                                                    : value}
                                                                                {column.id ==
                                                                                "action" ? (
                                                                                    <Box
                                                                                        sx={{
                                                                                            display:
                                                                                                "flex",
                                                                                            justifyContent:
                                                                                                "end",
                                                                                        }}
                                                                                    >
                                                                                        <LoadingButton
                                                                                            variant="contained"
                                                                                            color="success"
                                                                                            startIcon={
                                                                                                <DoneIcon />
                                                                                            }
                                                                                            sx={{
                                                                                                mr: "6px",
                                                                                            }}
                                                                                            onClick={() => {
                                                                                                updateRequest(
                                                                                                    row.id,
                                                                                                    row.username,
                                                                                                    1,
                                                                                                    row.threshold
                                                                                                )
                                                                                            }}
                                                                                            loading={
                                                                                                row.isLoading
                                                                                            }
                                                                                        >
                                                                                            Accept
                                                                                        </LoadingButton>
                                                                                        <LoadingButton
                                                                                            variant="contained"
                                                                                            color="error"
                                                                                            startIcon={
                                                                                                <CloseIcon />
                                                                                            }
                                                                                            onClick={() => {
                                                                                                updateRequest(
                                                                                                    row.id,
                                                                                                    row.username,
                                                                                                    -1,
                                                                                                    row.threshold
                                                                                                )
                                                                                            }}
                                                                                            loading={
                                                                                                row.isLoading
                                                                                            }
                                                                                        >
                                                                                            Reject
                                                                                        </LoadingButton>
                                                                                    </Box>
                                                                                ) : (
                                                                                    ""
                                                                                )}
                                                                            </TableCell>
                                                                        )
                                                                    }
                                                                )}
                                                            </TableRow>
                                                        )
                                                    })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 15, 20, 25]}
                                        component="div"
                                        count={pendingData.length}
                                        rowsPerPage={rowsPerPage1}
                                        page={page1}
                                        onPageChange={handleChangePage1}
                                        onRowsPerPageChange={
                                            handleChangeRowsPerPage1
                                        }
                                    />
                                </>
                            )}
                        </Box>
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: "bold", mt: "24px", ml: "10px" }}
                        >
                            History
                        </Typography>
                        <Box
                            sx={{
                                mt: "10px",
                                width: "100%",
                                backgroundColor:
                                    theme.palette.mode === "dark"
                                        ? "#1E1E1E"
                                        : "#F5F5F5",
                                borderRadius: 4,
                                padding: "20px",
                                pb: "6px",
                            }}
                        >
                            {historyData == null ? (
                                <>
                                    <TableContainer
                                        sx={{
                                            borderTopLeftRadius: 12,
                                            borderTopRightRadius: 12,
                                        }}
                                    >
                                        <Table
                                            stickyHeader
                                            aria-label="sticky table"
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    {columns2.map(
                                                        (column, index) => (
                                                            <TableCell
                                                                key={index}
                                                                align={
                                                                    column.align
                                                                }
                                                            >
                                                                {column.label}
                                                            </TableCell>
                                                        )
                                                    )}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={140}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={140}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={140}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={320}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={140}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={140}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={140}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={320}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={140}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={140}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={140}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={320}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Box
                                        sx={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "end",
                                        }}
                                    >
                                        <Skeleton
                                            variant="rounded"
                                            width={300}
                                            height={30}
                                            sx={{
                                                mt: "14px",
                                                mr: "18px",
                                                mb: "16px",
                                            }}
                                        />
                                    </Box>
                                </>
                            ) : historyData.length == 0 ? (
                                <>
                                    <TableContainer
                                        sx={{
                                            borderTopLeftRadius: 12,
                                            borderTopRightRadius: 12,
                                        }}
                                    >
                                        <Table
                                            stickyHeader
                                            aria-label="sticky table"
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    {columns2.map(
                                                        (column, index) => (
                                                            <TableCell
                                                                key={index}
                                                                align={
                                                                    column.align
                                                                }
                                                            >
                                                                {column.label}
                                                            </TableCell>
                                                        )
                                                    )}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody></TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            p: "20px",
                                        }}
                                    >
                                        <Typography variant="h6">
                                            No History Yet
                                        </Typography>
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <TableContainer
                                        sx={{
                                            borderTopLeftRadius: 12,
                                            borderTopRightRadius: 12,
                                        }}
                                    >
                                        <Table
                                            stickyHeader
                                            aria-label="sticky table"
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    {columns2.map(
                                                        (column, index) => (
                                                            <TableCell
                                                                key={index}
                                                                align={
                                                                    column.align
                                                                }
                                                            >
                                                                {column.label}
                                                            </TableCell>
                                                        )
                                                    )}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {historyData
                                                    .slice(
                                                        page2 * rowsPerPage2,
                                                        page2 * rowsPerPage2 +
                                                            rowsPerPage2
                                                    )
                                                    .map((row, index) => {
                                                        return (
                                                            <TableRow
                                                                hover
                                                                key={index}
                                                            >
                                                                {columns2.map(
                                                                    (
                                                                        column,
                                                                        index
                                                                    ) => {
                                                                        const value =
                                                                            row[
                                                                                column
                                                                                    .id
                                                                            ]
                                                                        return (
                                                                            <TableCell
                                                                                key={
                                                                                    index
                                                                                }
                                                                                align={
                                                                                    column.align
                                                                                }
                                                                            >
                                                                                {column.id ==
                                                                                "threshold"
                                                                                    ? Number(
                                                                                          value
                                                                                      ).toLocaleString()
                                                                                    : value}
                                                                            </TableCell>
                                                                        )
                                                                    }
                                                                )}
                                                            </TableRow>
                                                        )
                                                    })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 15, 20, 25]}
                                        component="div"
                                        count={historyData.length}
                                        rowsPerPage={rowsPerPage2}
                                        page={page2}
                                        onPageChange={handleChangePage2}
                                        onRowsPerPageChange={
                                            handleChangeRowsPerPage2
                                        }
                                    />
                                </>
                            )}
                        </Box>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "end",
                                mt: "24px",
                            }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SendIcon />}
                                onClick={() => setOpenModal(true)}
                            >
                                Send Request
                            </Button>
                        </Box>
                        <Modal
                            open={openModal}
                            onClose={() => setOpenModal(false)}
                            aria-labelledby="Send Request"
                            aria-describedby="Sending new request"
                            sx={{ zIndex: 50 }}
                        >
                            <Box
                                sx={{
                                    width: "320px",
                                    backgroundColor:
                                        theme.palette.mode === "dark"
                                            ? "#1E1E1E"
                                            : "#F5F5F5",
                                    borderRadius: 4,
                                    padding: "20px",
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    boxShadow: 24,
                                }}
                            >
                                {submitLoading ? (
                                    <>
                                        <TextField
                                            value={sRUsername}
                                            id="sRUsername"
                                            label="Username"
                                            sx={{ width: "100%", mb: "20px" }}
                                            disabled
                                        />
                                        <TextField
                                            value={sRThreshold}
                                            id="sRThreshold"
                                            label="Threshold Amount (in $)"
                                            sx={{ width: "100%", mb: "20px" }}
                                            disabled
                                        />
                                    </>
                                ) : (
                                    <>
                                        <TextField
                                            value={sRUsername}
                                            id="sRUsername"
                                            label="Username"
                                            sx={{ width: "100%", mb: "20px" }}
                                            onChange={(e) =>
                                                setSRUsername(e.target.value)
                                            }
                                        />
                                        <TextField
                                            value={sRThreshold}
                                            id="sRThreshold"
                                            label="Threshold Amount (in $)"
                                            sx={{ width: "100%", mb: "20px" }}
                                            onChange={(e) =>
                                                setSRThreshold(e.target.value)
                                            }
                                        />
                                    </>
                                )}
                                <LoadingButton
                                    onClick={() => sendRequest()}
                                    loading={submitLoading}
                                    loadingPosition="start"
                                    startIcon={<SendIcon />}
                                    variant="contained"
                                    sx={{
                                        borderRadius: 2,
                                        fontWeight: "bold",
                                        width: "280px",
                                        paddingY: "10px",
                                        mt: "20px",
                                    }}
                                >
                                    Send Request
                                </LoadingButton>
                            </Box>
                        </Modal>
                        <Box
                            sx={{
                                mt: "24px",
                                width: "100%",
                                backgroundColor:
                                    theme.palette.mode === "dark"
                                        ? "#1E1E1E"
                                        : "#F5F5F5",
                                borderRadius: 4,
                                padding: "20px",
                                pb: "6px",
                            }}
                        >
                            {outgoingData == null ? (
                                <>
                                    <TableContainer
                                        sx={{
                                            borderTopLeftRadius: 12,
                                            borderTopRightRadius: 12,
                                        }}
                                    >
                                        <Table
                                            stickyHeader
                                            aria-label="sticky table"
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    {columns3.map(
                                                        (column, index) => (
                                                            <TableCell
                                                                key={index}
                                                                align={
                                                                    column.align
                                                                }
                                                            >
                                                                {column.label}
                                                            </TableCell>
                                                        )
                                                    )}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={140}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={140}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={140}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={320}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent:
                                                                    "end",
                                                            }}
                                                        >
                                                            <Button
                                                                sx={{
                                                                    p: 0,
                                                                    cursor: "default",
                                                                    "&.MuiButtonBase-root:hover":
                                                                        {
                                                                            bgcolor:
                                                                                "transparent",
                                                                        },
                                                                }}
                                                            >
                                                                <Skeleton
                                                                    variant="rounded"
                                                                    width={100}
                                                                    height={40}
                                                                />
                                                            </Button>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={140}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={140}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={140}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={320}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent:
                                                                    "end",
                                                            }}
                                                        >
                                                            <Button
                                                                sx={{
                                                                    p: 0,
                                                                    cursor: "default",
                                                                    "&.MuiButtonBase-root:hover":
                                                                        {
                                                                            bgcolor:
                                                                                "transparent",
                                                                        },
                                                                }}
                                                            >
                                                                <Skeleton
                                                                    variant="rounded"
                                                                    width={100}
                                                                    height={40}
                                                                />
                                                            </Button>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={140}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={140}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={140}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Skeleton
                                                                variant="rounded"
                                                                width={320}
                                                                height={40}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent:
                                                                    "end",
                                                            }}
                                                        >
                                                            <Button
                                                                sx={{
                                                                    p: 0,
                                                                    cursor: "default",
                                                                    "&.MuiButtonBase-root:hover":
                                                                        {
                                                                            bgcolor:
                                                                                "transparent",
                                                                        },
                                                                }}
                                                            >
                                                                <Skeleton
                                                                    variant="rounded"
                                                                    width={100}
                                                                    height={40}
                                                                />
                                                            </Button>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Box
                                        sx={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "end",
                                        }}
                                    >
                                        <Skeleton
                                            variant="rounded"
                                            width={300}
                                            height={30}
                                            sx={{
                                                mt: "14px",
                                                mr: "18px",
                                                mb: "16px",
                                            }}
                                        />
                                    </Box>
                                </>
                            ) : outgoingData.length == 0 ? (
                                <>
                                    <TableContainer
                                        sx={{
                                            borderTopLeftRadius: 12,
                                            borderTopRightRadius: 12,
                                        }}
                                    >
                                        <Table
                                            stickyHeader
                                            aria-label="sticky table"
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    {columns3.map(
                                                        (column, index) => (
                                                            <TableCell
                                                                key={index}
                                                                align={
                                                                    column.align
                                                                }
                                                            >
                                                                {column.label}
                                                            </TableCell>
                                                        )
                                                    )}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody></TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            p: "20px",
                                        }}
                                    >
                                        <Typography variant="h6">
                                            No Request Sent
                                        </Typography>
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <TableContainer
                                        sx={{
                                            borderTopLeftRadius: 12,
                                            borderTopRightRadius: 12,
                                        }}
                                    >
                                        <Table
                                            stickyHeader
                                            aria-label="sticky table"
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    {columns3.map(
                                                        (column, index) => (
                                                            <TableCell
                                                                key={index}
                                                                align={
                                                                    column.align
                                                                }
                                                            >
                                                                {column.label}
                                                            </TableCell>
                                                        )
                                                    )}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {outgoingData
                                                    .slice(
                                                        page3 * rowsPerPage3,
                                                        page3 * rowsPerPage3 +
                                                            rowsPerPage3
                                                    )
                                                    .map((row, index) => {
                                                        return (
                                                            <TableRow
                                                                hover
                                                                key={index}
                                                            >
                                                                {columns3.map(
                                                                    (
                                                                        column,
                                                                        index
                                                                    ) => {
                                                                        const value =
                                                                            row[
                                                                                column
                                                                                    .id
                                                                            ]
                                                                        return (
                                                                            <TableCell
                                                                                key={
                                                                                    index
                                                                                }
                                                                                align={
                                                                                    column.align
                                                                                }
                                                                            >
                                                                                {column.id ==
                                                                                "threshold"
                                                                                    ? Number(
                                                                                          value
                                                                                      ).toLocaleString()
                                                                                    : value}
                                                                                {column.id ==
                                                                                "proof" ? (
                                                                                    row.status ==
                                                                                        "Pending" ||
                                                                                    row.status ==
                                                                                        "Rejected" ? (
                                                                                        ""
                                                                                    ) : (
                                                                                        <LoadingButton
                                                                                            variant="contained"
                                                                                            color="secondary"
                                                                                            startIcon={
                                                                                                <DownloadIcon />
                                                                                            }
                                                                                            onClick={() =>
                                                                                                downloadProof(
                                                                                                    row.cid
                                                                                                )
                                                                                            }
                                                                                            loading={
                                                                                                row.isLoading
                                                                                            }
                                                                                        >
                                                                                            Proof
                                                                                        </LoadingButton>
                                                                                    )
                                                                                ) : (
                                                                                    ""
                                                                                )}
                                                                            </TableCell>
                                                                        )
                                                                    }
                                                                )}
                                                            </TableRow>
                                                        )
                                                    })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 15, 20, 25]}
                                        component="div"
                                        count={outgoingData.length}
                                        rowsPerPage={rowsPerPage3}
                                        page={page3}
                                        onPageChange={handleChangePage3}
                                        onRowsPerPageChange={
                                            handleChangeRowsPerPage3
                                        }
                                    />
                                </>
                            )}
                        </Box>
                    </TabPanel>
                </Box>
            </Box>
        </Box>
    )
}

export default RequestsScreen
