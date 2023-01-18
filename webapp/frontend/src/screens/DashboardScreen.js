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
import { ethers } from "ethers"

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
    const [walletsData, setWalletsData] = useState(null)
    const [priceData, setPriceData] = useState(null)
    const [apiCounter, setApiCounter] = useState(null)
    const [tabD, setTabD] = useState(null)

    useEffect(() => {
        if (cookies.snackbar) {
            setSnackbarSeverity(cookies.snackbar.snackbarSeverity)
            setSnackbarMessage(cookies.snackbar.snackbarMessage)
            setIsSnackbarOpen(true)
            removeCookie("snackbar", { path: "/" })
        }
        const innerFunction = async () => {
            try {
                const walletResp = await axios({
                    method: "get",
                    url: "/api/wallets",
                    headers: { Authorization: "Bearer " + cookies.token },
                })
                if (!("error" in walletResp.data)) {
                    setWalletsData(walletResp.data.data)
                } else {
                    setSnackbarSeverity("error")
                    setSnackbarMessage(
                        "Oops something went wrong in fetching data! Please reload"
                    )
                    setIsSnackbarOpen(true)
                }
            } catch (error) {
                setSnackbarSeverity("error")
                setSnackbarMessage(
                    "Oops something went wrong in fetching data! Please reload"
                )
                setIsSnackbarOpen(true)
            }
        }
        innerFunction()
    }, [])

    useEffect(() => {
        if (walletsData != null) {
            const innerFunction = async () => {
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
                        let prices = []
                        for (let i = 0; i < priceResp.data.data.length; i++) {
                            prices.push(
                                Number(
                                    ethers.utils.formatUnits(
                                        priceResp.data.data[i],
                                        priceTokens.decimalPlaces[i]
                                    )
                                )
                            )
                        }
                        setPriceData(prices)
                    } else {
                        setSnackbarSeverity("error")
                        setSnackbarMessage(
                            "Oops something went wrong in fetching data! Please reload"
                        )
                        setIsSnackbarOpen(true)
                    }
                } catch (error) {
                    setSnackbarSeverity("error")
                    setSnackbarMessage(
                        "Oops something went wrong in fetching data! Please reload"
                    )
                    setIsSnackbarOpen(true)
                }
            }
            innerFunction()
        }
    }, [walletsData])

    useEffect(() => {
        if (priceData != null) {
            setApiCounter(walletsData.length * quantityTokens.length)
        }
    }, [priceData])

    useEffect(() => {
        if (apiCounter != null) {
            if (apiCounter == 0) {
                setSnackbarSeverity("success")
                setSnackbarMessage("All data fetched successfully!")
                setIsSnackbarOpen(true)
            } else {
                const innerFunction = async () => {
                    let walletData =
                        walletsData[
                            walletsData.length -
                                Math.ceil(apiCounter / quantityTokens.length)
                        ]
                    let quantityToken =
                        quantityTokens[
                            quantityTokens.length -
                                (apiCounter -
                                    (Math.ceil(
                                        apiCounter / quantityTokens.length
                                    ) -
                                        1) *
                                        quantityTokens.length)
                        ]
                    try {
                        const quantityResp = await axios({
                            method: "get",
                            url: "/api/dashboard/quantity",
                            headers: {
                                Authorization: "Bearer " + cookies.token,
                            },
                            params: {
                                walletAddress: walletData.walletAddress,
                                network: quantityToken.network,
                                tokens: quantityToken.tokens,
                            },
                        })
                        if (!("error" in quantityResp.data)) {
                            let newTabD
                            if (tabD == null) {
                                let wallet
                                if (tabData == null) {
                                    wallet = "W1"
                                } else {
                                    wallet =
                                        "W" +
                                        (
                                            parseInt(
                                                tabData[
                                                    tabData.length - 1
                                                ].wallet.slice(1)
                                            ) + 1
                                        ).toString()
                                }
                                newTabD = {
                                    type: walletData.type,
                                    wallet,
                                    walletAddress: walletData.walletAddress,
                                    quantity: {},
                                }
                            } else {
                                newTabD = tabD
                            }
                            let quantityList = []
                            let networkNetWorth = 0
                            let newBarData
                            if (barData == null) {
                                let emptyData = []
                                for (
                                    let y = 0;
                                    y < priceTokens.names.length;
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
                                            borderColor: "rgb(53, 162, 235)",
                                        },
                                    ],
                                }
                            } else {
                                newBarData = barData
                            }
                            let newDoughnutData
                            if (doughnutData == null) {
                                let emptyData = []
                                for (
                                    let y = 0;
                                    y < priceTokens.names.length;
                                    y++
                                ) {
                                    emptyData.push(0)
                                }
                                newDoughnutData = {
                                    labels: priceTokens.names,
                                    datasets: [
                                        {
                                            data: emptyData,
                                            backgroundColor: colors,
                                            borderColor: borderColors,
                                            borderWidth: 1,
                                        },
                                    ],
                                }
                            } else {
                                newDoughnutData = doughnutData
                            }
                            for (
                                let x = 0;
                                x < quantityToken.names.length;
                                x++
                            ) {
                                const currentQuantity = Number(
                                    ethers.utils.formatUnits(
                                        quantityResp.data.data[x],
                                        quantityToken.decimalPlaces[x]
                                    )
                                )
                                const priceIndex = priceTokens.names.indexOf(
                                    quantityToken.names[x]
                                )
                                networkNetWorth +=
                                    priceData[priceIndex] * currentQuantity
                                newDoughnutData.datasets[0].data[priceIndex] +=
                                    currentQuantity * priceData[priceIndex]
                                newBarData.datasets[0].data[priceIndex] +=
                                    currentQuantity
                                quantityList.push({
                                    cryptoName: quantityToken.names[x],
                                    quantity: currentQuantity,
                                })
                            }
                            newTabD.quantity[quantityToken.networkDisplayName] =
                                quantityList
                            const newNetWorth = (
                                Number(netWorth == null ? 0 : netWorth) +
                                Number(networkNetWorth)
                            ).toFixed(2)
                            let newTabData =
                                tabData == null
                                    ? []
                                    : tabD == null
                                    ? tabData
                                    : tabData.slice(0, -1)
                            newTabData.push(newTabD)
                            let newPieData
                            if (pieData == null) {
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
                                newPieData = pieData
                            }
                            if (tabD == null) {
                                newPieData.labels.push(newTabD.wallet)
                                newPieData.datasets[0].data.push(
                                    networkNetWorth
                                )
                            } else {
                                newPieData.datasets[0].data[
                                    newPieData.datasets[0].data.length - 1
                                ] += networkNetWorth
                            }
                            const newApiCounter = apiCounter - 1
                            setNetWorth(newNetWorth)
                            setDoughnutData(newDoughnutData)
                            setBarData(newBarData)
                            setPieData(newPieData)
                            if ((apiCounter - 1) % quantityTokens.length == 0) {
                                setTabD(null)
                            } else {
                                setTabD(newTabD)
                            }
                            setTabData(newTabData)
                            setApiCounter(newApiCounter)
                        } else {
                            setSnackbarSeverity("error")
                            setSnackbarMessage(
                                "Oops something went wrong in fetching data! Please reload"
                            )
                            setIsSnackbarOpen(true)
                        }
                    } catch (error) {
                        setSnackbarSeverity("error")
                        setSnackbarMessage(
                            "Oops something went wrong in fetching data! Please reload"
                        )
                        setIsSnackbarOpen(true)
                    }
                }
                innerFunction()
            }
        }
    }, [apiCounter])

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
