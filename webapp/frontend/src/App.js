import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import CssBaseline from "@mui/material/CssBaseline"
import useMediaQuery from "@mui/material/useMediaQuery"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { useCookies } from "react-cookie"
import { Web3Modal } from "@web3modal/react"
import {
    EthereumClient,
    modalConnectors,
    walletConnectProvider,
} from "@web3modal/ethereum"
import { chain, configureChains, createClient, WagmiConfig } from "wagmi"

import AuthScreen from "./screens/AuthScreen"
import SignupScreen from "./screens/SignupScreen"
import DashboardScreen from "./screens/DashboardScreen"
import WalletsScreen from "./screens/WalletsScreen"
import RequestsScreen from "./screens/RequestsScreen"
import PageNotFoundScreen from "./screens/PageNotFoundScreen"

export const ColorModeContext = React.createContext({
    toggleColorMode: () => {},
})

const chains = [chain.polygonMumbai]

// Wagmi client
const { provider } = configureChains(chains, [
    walletConnectProvider({ projectId: "4b4558901d6b19785f6f2d45987752f1" }),
])
const wagmiClient = createClient({
    autoConnect: true,
    connectors: modalConnectors({ appName: "web3Modal", chains }),
    provider,
})

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains)

function App() {
    const [cookies, setCookie] = useCookies([])

    const systemDefaultMode = useMediaQuery("(prefers-color-scheme: dark)")
        ? "dark"
        : "light"
    const [mode, setMode] = React.useState(() => {
        if (!cookies.Mode) return systemDefaultMode
        return cookies.Mode
    })
    const toggleColorMode = () => {
        setCookie("Mode", mode === "light" ? "dark" : "light", {
            path: "/",
        })
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"))
    }
    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
                typography: {
                    fontFamily: [
                        "Nunito",
                        "Roboto",
                        "Arial",
                        "sans-serif",
                    ].join(","),
                    button: {
                        textTransform: "none",
                    },
                },
            }),
        [mode]
    )

    const drawerWidth = 196

    return (
        <ColorModeContext.Provider value={toggleColorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                <Web3Modal
                    projectId="4b4558901d6b19785f6f2d45987752f1"
                    theme="dark"
                    accentColor="blackWhite"
                    ethereumClient={ethereumClient}
                    themeZIndex="100"
                />
                <WagmiConfig client={wagmiClient}>
                    <Router>
                        <Routes>
                            <Route path="/" element={<AuthScreen />} />
                            <Route path="/signup" element={<SignupScreen />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <DashboardScreen
                                        drawerWidth={drawerWidth}
                                    />
                                }
                            />
                            <Route
                                path="/wallets"
                                element={
                                    <WalletsScreen drawerWidth={drawerWidth} />
                                }
                            />
                            <Route
                                path="/requests"
                                element={
                                    <RequestsScreen drawerWidth={drawerWidth} />
                                }
                            />
                            <Route
                                path="*"
                                element={
                                    <PageNotFoundScreen
                                        drawerWidth={drawerWidth}
                                    />
                                }
                            />
                        </Routes>
                    </Router>
                </WagmiConfig>
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
}

export default App
