import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import { Typography } from "@mui/material"
import Skeleton from "@mui/material/Skeleton"
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
import CircularProgress from "@mui/material/CircularProgress"
import Drawer from "../components/Drawer"
import Topbar from "../components/Topbar"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import { useCookies } from "react-cookie"
import PropTypes from "prop-types"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import DashboardTabPanel from "../components/DashboardTabPanel"
import axios from "axios"
import {
    priceTokens,
    quantityTokens,
    colors,
    borderColors,
} from "../utils/dashboardData"

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ChartJSTooltip,
    Legend,
    ArcElement
)

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

const DashboardScreen = ({ drawerWidth }) => {
    const theme = useTheme()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
    const [snackbarSeverity, setSnackbarSeverity] = useState("success")
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [cookies, setCookie, removeCookie] = useCookies([])
    const barOptions = {
        indexAxis: "y",
        elements: {
            bar: {
                borderWidth: 1,
            },
        },
        responsive: true,
        plugins: {
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
            legend: {
                position: "bottom",
                labels: {
                    color: theme.palette.mode === "dark" ? "white" : "black",
                },
            },
        },
    }

    const [netWorth, setNetWorth] = useState(null)
    const [doughnutData, setDoughnutData] = useState(null)
    const [barData, setBarData] = useState(null)
    const [pieData, setPieData] = useState(null)
    const [tabData, setTabData] = useState(null)
    const [tabValue, setTabValue] = useState(0)

    useEffect(() => {
        if (cookies.snackbar) {
            setSnackbarSeverity(cookies.snackbar.snackbarSeverity)
            setSnackbarMessage(cookies.snackbar.snackbarMessage)
            setIsSnackbarOpen(true)
            removeCookie("snackbar", { path: "/" })
        }

        const dashboardDataFetcher = async () => {
            let updated = true

            let walletsData

            // Fetching wallets
            try {
                const walletResp = await axios({
                    method: "get",
                    url: "/api/wallets",
                    headers: { Authorization: "Bearer " + cookies.token },
                })

                if (!("error" in walletResp.data)) {
                    walletsData = walletResp.data.data
                } else {
                    updated = false
                    setSnackbarSeverity("error")
                    setSnackbarMessage(
                        "Oops something went wrong in fetching data! Please reload"
                    )
                    setIsSnackbarOpen(true)
                }
            } catch (error) {
                updated = false
                setSnackbarSeverity("error")
                setSnackbarMessage(
                    "Oops something went wrong in fetching data! Please reload"
                )
                setIsSnackbarOpen(true)
            }

            let priceData

            // Fetching prices
            if (updated) {
                try {
                    const priceResp = await axios({
                        method: "get",
                        url: "/api/dashboard/price",
                        headers: {
                            Authorization: "Bearer " + cookies.token,
                        },
                        params: {
                            tokens: priceTokens.tokens,
                            network: priceTokens.network,
                        },
                    })
                    if (!("error" in priceResp.data)) {
                        priceData = priceResp.data.data
                    } else {
                        updated = false
                        setSnackbarSeverity("error")
                        setSnackbarMessage(
                            "Oops something went wrong in fetching data! Please reload"
                        )
                        setIsSnackbarOpen(true)
                    }
                } catch (error) {
                    updated = false
                    setSnackbarSeverity("error")
                    setSnackbarMessage(
                        "Oops something went wrong in fetching data! Please reload"
                    )
                    setIsSnackbarOpen(true)
                }
            }

            let netWorthTemp = 0
            let doughnutDataTemp = null
            let barDataTemp = null
            let pieDataTemp = null
            let tabDataTemp = null

            // Fetching data for each wallet on multiple networks for multiple tokens and updating the frontend
            if (updated) {
                for (let a = 0; a < walletsData.length; a++) {
                    let walletData = walletsData[a]
                    if (updated) {
                        let tabD = null
                        let walletNetWorth = 0
                        for (let b = 0; b < quantityTokens.length; b++) {
                            let quantityToken = quantityTokens[b]
                            if (updated) {
                                try {
                                    const quantityResp = await axios({
                                        method: "get",
                                        url: "/api/dashboard/quantity",
                                        headers: {
                                            Authorization:
                                                "Bearer " + cookies.token,
                                        },
                                        params: {
                                            walletAddress:
                                                walletData.walletAddress,
                                            network: quantityToken.network,
                                            tokens: quantityToken.tokens,
                                        },
                                    })
                                    if (!("error" in quantityResp.data)) {
                                        if (tabD == null) {
                                            let wallet = "W1"
                                            if (tabDataTemp == null) {
                                                wallet = "W1"
                                            } else {
                                                wallet =
                                                    "W" +
                                                    (
                                                        parseInt(
                                                            tabDataTemp[
                                                                tabDataTemp.length -
                                                                    1
                                                            ].wallet.slice(1)
                                                        ) + 1
                                                    ).toString()
                                            }
                                            tabD = {
                                                type: walletData.type,
                                                wallet,
                                                walletAddress:
                                                    walletData.walletAddress,
                                                quantity: {},
                                            }
                                        }
                                        let quantityList = []
                                        for (
                                            let x = 0;
                                            x < quantityToken.names.length;
                                            x++
                                        ) {
                                            quantityList.push({
                                                cryptoName:
                                                    quantityToken.names[x],
                                                quantity:
                                                    quantityResp.data.data[x],
                                            })
                                            const priceIndex =
                                                priceTokens.names.indexOf(
                                                    quantityToken.names[x]
                                                )
                                            walletNetWorth +=
                                                priceData[priceIndex] *
                                                quantityResp.data.data[x]
                                            let newBarData
                                            if (barDataTemp == null) {
                                                let emptyData = []
                                                for (
                                                    let y = 0;
                                                    y <
                                                    priceTokens.names.length;
                                                    y++
                                                ) {
                                                    emptyData.push(0)
                                                }
                                                newBarData = {
                                                    labels: priceTokens.names,
                                                    datasets: [
                                                        {
                                                            label: "Quantity",
                                                            data: emptyData,
                                                            backgroundColor:
                                                                "rgba(53, 162, 235, 0.2)",
                                                            borderColor:
                                                                "rgb(53, 162, 235)",
                                                        },
                                                    ],
                                                }
                                            } else {
                                                newBarData = barDataTemp
                                            }
                                            newBarData.datasets[0].data[
                                                priceIndex
                                            ] += quantityResp.data.data[x]
                                            barDataTemp = newBarData
                                            let newDoughnutData
                                            if (doughnutDataTemp == null) {
                                                let emptyData = []
                                                for (
                                                    let y = 0;
                                                    y <
                                                    priceTokens.names.length;
                                                    y++
                                                ) {
                                                    emptyData.push(0)
                                                }
                                                newDoughnutData = {
                                                    labels: priceTokens.names,
                                                    datasets: [
                                                        {
                                                            data: emptyData,
                                                            backgroundColor:
                                                                colors,
                                                            borderColor:
                                                                borderColors,
                                                            borderWidth: 1,
                                                        },
                                                    ],
                                                }
                                            } else {
                                                newDoughnutData =
                                                    doughnutDataTemp
                                            }
                                            newDoughnutData.datasets[0].data[
                                                priceIndex
                                            ] =
                                                newBarData.datasets[0].data[
                                                    priceIndex
                                                ] * priceData[priceIndex]
                                            doughnutDataTemp = newDoughnutData
                                        }
                                        tabD.quantity[
                                            quantityToken.networkDisplayName
                                        ] = quantityList
                                    } else {
                                        updated = false
                                        setSnackbarSeverity("error")
                                        setSnackbarMessage(
                                            "Oops something went wrong in fetching data! Please reload"
                                        )
                                        setIsSnackbarOpen(true)
                                    }
                                } catch (error) {
                                    console.log(error)
                                    updated = false
                                    setSnackbarSeverity("error")
                                    setSnackbarMessage(
                                        "Oops something went wrong in fetching data! Please reload"
                                    )
                                    setIsSnackbarOpen(true)
                                }
                            }
                        }
                        let newTabData =
                            tabDataTemp == null ? [] : [...tabDataTemp]
                        newTabData.push(tabD)
                        tabDataTemp = newTabData
                        const newNetWorth = netWorthTemp + walletNetWorth
                        netWorthTemp = newNetWorth
                        let newPieData
                        if (pieDataTemp == null) {
                            newPieData = {
                                labels: [],
                                datasets: [
                                    {
                                        data: [],
                                        backgroundColor: colors,
                                        borderColor: borderColors,
                                        borderWidth: 1,
                                    },
                                ],
                            }
                        } else {
                            newPieData = pieDataTemp
                        }
                        newPieData.labels.push(tabD.wallet)
                        newPieData.datasets[0].data.push(walletNetWorth)
                        pieDataTemp = newPieData
                    }
                }
            }

            // Displaying message that all data has been updated
            if (updated) {
                setNetWorth(netWorthTemp.toFixed(2))
                setDoughnutData(doughnutDataTemp)
                setBarData(barDataTemp)
                setPieData(pieDataTemp)
                setTabData(tabDataTemp)
                setSnackbarSeverity("success")
                setSnackbarMessage("Data fetched successfully!")
                setIsSnackbarOpen(true)
            }
        }

        dashboardDataFetcher()
    }, [])

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const closeSnackBar = () => {
        setIsSnackbarOpen(false)
    }

    const handleChangeTab = (event, newTabValue) => {
        setTabValue(newTabValue)
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
                            justifyContent: "space-evenly",
                            flexDirection: "column",
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
                                Net Worth Per Crypto
                            </Typography>
                        </Box>
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
                            justifyContent: "space-evenly",
                            flexDirection: "column",
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
                                Quantity Per Crypto
                            </Typography>
                        </Box>
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
                            justifyContent: "space-evenly",
                            flexDirection: "column",
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
                                Net Worth Per Wallet
                            </Typography>
                        </Box>
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
                    {tabData == null ? (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "column",
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <Tabs value={tabValue} onChange={handleChangeTab}>
                                {tabData.map((obj, index) => {
                                    return (
                                        <Tab
                                            label={<Box>{obj.wallet}</Box>}
                                            {...a11yProps(index)}
                                        />
                                    )
                                })}
                            </Tabs>
                            {tabData.map((obj, index) => {
                                return (
                                    <TabPanel value={tabValue} index={index}>
                                        <DashboardTabPanel
                                            data={obj}
                                        ></DashboardTabPanel>
                                    </TabPanel>
                                )
                            })}
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    )
}

export default DashboardScreen
