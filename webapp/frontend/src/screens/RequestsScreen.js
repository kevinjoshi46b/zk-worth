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

    // Update this to fetch requests
    useEffect(() => {
        if (cookies.snackbar) {
            setSnackbarSeverity(cookies.snackbar.snackbarSeverity)
            setSnackbarMessage(cookies.snackbar.snackbarMessage)
            setIsSnackbarOpen(true)
            removeCookie("snackbar", { path: "/" })
        }
        setTimeout(() => {
            setPendingData([
                {
                    username: "devansh",
                    threshold: "10000",
                },
            ])
            setHistoryData([
                // {
                //     username: "kaushal",
                //     threshold: "42000",
                //     action: "Accepted",
                //     response: "Net worth is below threshold amount",
                // },
                // {
                //     username: "rajas",
                //     threshold: "1000",
                //     action: "Rejected",
                //     response: "-",
                // },
            ])
            setOutgoingData([
                {
                    username: "sparsh",
                    threshold: "10100",
                    result: "Net worth is equal to or above threshold amount",
                    status: "Accepted",
                },
                {
                    username: "hardik",
                    threshold: "2200",
                    result: "-",
                    status: "Pending",
                },
            ])
        }, 3000)
    }, [])

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const handleChangeTab = (event, newTabValue) => {
        setTabValue(newTabValue)
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
                                                                                        {/* Accept/reject request functionality to be added */}
                                                                                        <Button
                                                                                            variant="contained"
                                                                                            color="success"
                                                                                            startIcon={
                                                                                                <DoneIcon />
                                                                                            }
                                                                                            sx={{
                                                                                                mr: "6px",
                                                                                            }}
                                                                                        >
                                                                                            Accept
                                                                                        </Button>
                                                                                        <Button
                                                                                            variant="contained"
                                                                                            color="error"
                                                                                            startIcon={
                                                                                                <CloseIcon />
                                                                                            }
                                                                                        >
                                                                                            Reject
                                                                                        </Button>
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
                            {/* Send request page/functionality to be added here */}
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SendIcon />}
                            >
                                Send Request
                            </Button>
                        </Box>
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
                                                                                        "-"
                                                                                    ) : (
                                                                                        // Download proof functionality to be added here
                                                                                        <Button
                                                                                            variant="contained"
                                                                                            color="secondary"
                                                                                            startIcon={
                                                                                                <DownloadIcon />
                                                                                            }
                                                                                        >
                                                                                            Proof
                                                                                        </Button>
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
