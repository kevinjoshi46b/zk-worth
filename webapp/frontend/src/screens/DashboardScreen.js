import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import { Typography } from "@mui/material"
import Skeleton from "@mui/material/Skeleton"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import { useTheme } from "@mui/material/styles"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip as ChartJSTooltip,
    Legend,
    ArcElement,
} from "chart.js"
import { Bar, Doughnut, Pie } from "react-chartjs-2"
import Chip from "@mui/material/Chip"
import Button from "@mui/material/Button"
import Tooltip from "@mui/material/Tooltip"
import CircularProgress from "@mui/material/CircularProgress"
import { shortner } from "../utils/walletAddressShortner"
import Drawer from "../components/Drawer"
import Topbar from "../components/Topbar"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import { useCookies } from "react-cookie"

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ChartJSTooltip,
    Legend,
    ArcElement
)

const DashboardScreen = ({ drawerWidth }) => {
    const theme = useTheme()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
    const [snackbarSeverity, setSnackbarSeverity] = useState("success")
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [cookies, setCookie, removeCookie] = useCookies([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const barOptions = {
        indexAxis: "y",
        elements: {
            bar: {
                borderWidth: 1,
            },
        },
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: "Quantity Per Crypto",
                color: theme.palette.mode === "dark" ? "white" : "black",
            },
            legend: {
                position: "right",
                labels: {
                    color: theme.palette.mode === "dark" ? "white" : "black",
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    color: theme.palette.mode === "dark" ? "white" : "black",
                    beginAtZero: true,
                },
                grid: {
                    display: false,
                },
            },
            x: {
                ticks: {
                    color: theme.palette.mode === "dark" ? "white" : "black",
                    beginAtZero: true,
                },
                grid: {
                    display: false,
                },
            },
        },
    }
    const doughnutOptions = {
        plugins: {
            title: {
                display: true,
                text: "Net Worth Per Crypto",
                color: theme.palette.mode === "dark" ? "white" : "black",
            },
            legend: {
                position: "bottom",
                labels: {
                    color: theme.palette.mode === "dark" ? "white" : "black",
                },
            },
        },
    }
    const pieOptions = {
        plugins: {
            title: {
                display: true,
                text: "Net Worth Per Wallet",
                color: theme.palette.mode === "dark" ? "white" : "black",
            },
            legend: {
                position: "bottom",
                labels: {
                    color: theme.palette.mode === "dark" ? "white" : "black",
                },
            },
        },
    }
    const columns = [
        { id: "wallet", label: "" },
        { id: "walletAddress", label: "Wallet Address" },
        { id: "ethereum", label: "Ethereum" },
        { id: "polygon", label: "Polygon" },
        { id: "avalanche", label: "Avalanche" },
        { id: "arbitrum", label: "Arbitrum" },
    ]
    const [netWorth, setNetWorth] = useState(null)
    const [doughnutData, setDoughnutData] = useState(null)
    const [barData, setBarData] = useState(null)
    const [pieData, setPieData] = useState(null)
    const [tableData, setTableData] = useState(null)

    // Update this to fetch and update all the data sequentially
    useEffect(() => {
        if (cookies.snackbar) {
            setSnackbarSeverity(cookies.snackbar.snackbarSeverity)
            setSnackbarMessage(cookies.snackbar.snackbarMessage)
            setIsSnackbarOpen(true)
            removeCookie("snackbar", { path: "/" })
        }
        setTimeout(() => {
            setNetWorth(13021.11)
            setDoughnutData({
                labels: ["Ethereum", "Polygon", "Arbitrum", "Avalanche"],
                datasets: [
                    {
                        data: [10000, 300, 1400, 2000],
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)",
                        ],
                        borderWidth: 1,
                    },
                ],
            })
            setBarData({
                labels: ["Ethereum", "Polygon", "Arbitrum", "Avalanche"],
                datasets: [
                    {
                        label: "Quantity",
                        data: [17.71, 14, 9.7, 0.3],
                        borderColor: "rgb(53, 162, 235)",
                        backgroundColor: "rgba(53, 162, 235, 0.2)",
                    },
                ],
            })
            setPieData({
                labels: ["W1", "W2", "W3", "W4"],
                datasets: [
                    {
                        data: [10000, 3000, 4300, 6000],
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)",
                        ],
                        borderWidth: 1,
                    },
                ],
            })
            setTableData([
                {
                    type: "primary",
                    wallet: "W1",
                    walletAddress: "0x707Vu8kHRMZBN4KF18lFr11Cb",
                    // ethereum: "3.21",
                    polygon: "4",
                    avalanche: "0",
                    arbitrum: "0",
                },
                {
                    type: "secondary",
                    wallet: "W2",
                    walletAddress: "0x847RAabTa1QtTX17DbU4p1x23",
                    ethereum: "2.1",
                    polygon: "0",
                    avalanche: "0",
                    arbitrum: "0",
                },
                {
                    type: "secondary",
                    wallet: "W3",
                    walletAddress: "0x7319ybchYF1wSKPRgTBpY444p",
                    ethereum: "0",
                    polygon: "10",
                    avalanche: "9.7",
                    arbitrum: "0.3",
                },
                {
                    type: "secondary",
                    wallet: "W4",
                    walletAddress: "0x912kWsdo6UXE7UVHrhS95xy64",
                    ethereum: "12.4",
                    polygon: "0",
                    avalanche: "0",
                    arbitrum: "0",
                },
            ])
        }, 3000)
    }, [])

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
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
                pageType="Dashboard"
                drawerWidth={drawerWidth}
                handleDrawerToggle={handleDrawerToggle}
            />

            {/* Drawer */}
            <Drawer
                drawerWidth={drawerWidth}
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
                pageType="Dashboard"
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
                <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    sx={{ ml: "10px" }}
                >
                    Total Net Worth
                </Typography>
                {netWorth == null ? (
                    <Skeleton width={160} height={64} sx={{ ml: "10px" }} />
                ) : (
                    <Typography
                        variant="h4"
                        sx={{
                            mt: "2px",
                            fontWeight: "700",
                            ml: "10px",
                        }}
                    >
                        ${netWorth}
                    </Typography>
                )}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        pt: "38px",
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor:
                                theme.palette.mode === "dark"
                                    ? "#1E1E1E"
                                    : "#F5F5F5",
                            borderRadius: 4,
                            padding: "20px",
                            width: { xs: "100%", sm: "24%" },
                            minWidth: { sm: "320px" },
                            mb: "24px",
                            mr: { sm: "24px" },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {doughnutData == null ? (
                            <CircularProgress />
                        ) : (
                            <Doughnut
                                options={doughnutOptions}
                                data={doughnutData}
                            />
                        )}
                    </Box>
                    <Box
                        sx={{
                            backgroundColor:
                                theme.palette.mode === "dark"
                                    ? "#1E1E1E"
                                    : "#F5F5F5",
                            borderRadius: 4,
                            padding: "20px",
                            width: { xs: "100%", sm: "42%" },
                            minWidth: { sm: "472px" },
                            mb: "24px",
                            mr: { sm: "24px" },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {barData == null ? (
                            <CircularProgress />
                        ) : (
                            <Bar options={barOptions} data={barData} />
                        )}
                    </Box>
                    <Box
                        sx={{
                            backgroundColor:
                                theme.palette.mode === "dark"
                                    ? "#1E1E1E"
                                    : "#F5F5F5",
                            borderRadius: 4,
                            padding: "20px",
                            width: { xs: "100%", sm: "24%" },
                            minWidth: { sm: "320px" },
                            mb: "24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {pieData == null ? (
                            <CircularProgress />
                        ) : (
                            <Pie options={pieOptions} data={pieData} />
                        )}
                    </Box>
                </Box>
                <Box
                    sx={{
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
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Typography
                            variant="caption"
                            sx={{
                                fontWeight: "bold",
                                mb: "14px",
                            }}
                        >
                            Quantity Per Wallet
                        </Typography>
                    </Box>
                    {tableData == null ? (
                        <>
                            <TableContainer
                                sx={{
                                    borderTopLeftRadius: 12,
                                    borderTopRightRadius: 12,
                                }}
                            >
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column, index) => (
                                                <TableCell
                                                    key={index}
                                                    align={column.align}
                                                >
                                                    {column.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <Box>
                                                    <Skeleton
                                                        variant="rounded"
                                                        width={70}
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
                                            <TableCell>
                                                <Box>
                                                    <Skeleton
                                                        variant="rounded"
                                                        width={70}
                                                        height={40}
                                                    />
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Skeleton
                                                        variant="rounded"
                                                        width={70}
                                                        height={40}
                                                    />
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Skeleton
                                                        variant="rounded"
                                                        width={70}
                                                        height={40}
                                                    />
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Skeleton
                                                        variant="rounded"
                                                        width={70}
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
                                                        width={70}
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
                                            <TableCell>
                                                <Box>
                                                    <Skeleton
                                                        variant="rounded"
                                                        width={70}
                                                        height={40}
                                                    />
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Skeleton
                                                        variant="rounded"
                                                        width={70}
                                                        height={40}
                                                    />
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Skeleton
                                                        variant="rounded"
                                                        width={70}
                                                        height={40}
                                                    />
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Skeleton
                                                        variant="rounded"
                                                        width={70}
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
                                                        width={70}
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
                                            <TableCell>
                                                <Box>
                                                    <Skeleton
                                                        variant="rounded"
                                                        width={70}
                                                        height={40}
                                                    />
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Skeleton
                                                        variant="rounded"
                                                        width={70}
                                                        height={40}
                                                    />
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Skeleton
                                                        variant="rounded"
                                                        width={70}
                                                        height={40}
                                                    />
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Skeleton
                                                        variant="rounded"
                                                        width={70}
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
                    ) : (
                        <>
                            <TableContainer
                                sx={{
                                    borderTopLeftRadius: 12,
                                    borderTopRightRadius: 12,
                                }}
                            >
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column, index) => (
                                                <TableCell key={index}>
                                                    {column.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tableData
                                            .slice(
                                                page * rowsPerPage,
                                                page * rowsPerPage + rowsPerPage
                                            )
                                            .map((row, index) => {
                                                return (
                                                    <TableRow hover key={index}>
                                                        {columns.map(
                                                            (column, index) => {
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
                                                                    >
                                                                        {column.id ==
                                                                        "walletAddress" ? (
                                                                            <Box
                                                                                sx={{
                                                                                    display:
                                                                                        "flex",
                                                                                    alignItems:
                                                                                        "center",
                                                                                }}
                                                                            >
                                                                                <Tooltip
                                                                                    title={
                                                                                        value
                                                                                    }
                                                                                >
                                                                                    <Button
                                                                                        sx={{
                                                                                            cursor: "default",
                                                                                            "&.MuiButtonBase-root:hover":
                                                                                                {
                                                                                                    bgcolor:
                                                                                                        "transparent",
                                                                                                },
                                                                                            color:
                                                                                                theme
                                                                                                    .palette
                                                                                                    .mode ===
                                                                                                "dark"
                                                                                                    ? "#FFFFFF"
                                                                                                    : "#000000",
                                                                                            mr: "6px",
                                                                                        }}
                                                                                    >
                                                                                        {shortner(
                                                                                            value
                                                                                        )}
                                                                                    </Button>
                                                                                </Tooltip>
                                                                                {row.type ==
                                                                                "primary" ? (
                                                                                    <Chip
                                                                                        size="small"
                                                                                        label="primary"
                                                                                        color="success"
                                                                                        variant="outlined"
                                                                                    />
                                                                                ) : (
                                                                                    ""
                                                                                )}
                                                                            </Box>
                                                                        ) : value ==
                                                                          null ? (
                                                                            <Box>
                                                                                <Skeleton
                                                                                    variant="rounded"
                                                                                    width={
                                                                                        70
                                                                                    }
                                                                                    height={
                                                                                        40
                                                                                    }
                                                                                />
                                                                            </Box>
                                                                        ) : (
                                                                            value
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
                                count={tableData.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    )
}

export default DashboardScreen
