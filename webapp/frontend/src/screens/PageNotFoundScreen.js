import { useState } from "react"
import Box from "@mui/material/Box"
import { Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { Link } from "react-router-dom"
import Button from "@mui/material/Button"

import Drawer from "../components/Drawer"
import Topbar from "../components/Topbar"

const PageNotFoundScreen = ({ drawerWidth }) => {
    const theme = useTheme()
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    return (
        <Box>
            {/* Top Bar */}
            <Topbar
                pageType="NotFound"
                drawerWidth={drawerWidth}
                handleDrawerToggle={handleDrawerToggle}
            />

            {/* Drawer */}
            <Drawer
                drawerWidth={drawerWidth}
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
                pageType="NotFound"
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
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor:
                            theme.palette.mode === "dark"
                                ? "#1E1E1E"
                                : "#F5F5F5",
                        borderRadius: 4,
                        padding: "28px",
                    }}
                >
                    <Typography variant="h2" align="center" sx={{ mb: "6px" }}>
                        Oops...
                    </Typography>
                    <Typography variant="h5" align="center" sx={{ mb: "28px" }}>
                        Page Not Found
                    </Typography>
                    <Link
                        to="/"
                        style={{
                            color: "inherit",
                            textDecoration: "inherit",
                        }}
                        align="center"
                    >
                        <Button variant="contained" size="large">
                            <Typography sx={{ fontWeight: "bold" }}>
                                Home
                            </Typography>
                        </Button>
                    </Link>
                </Box>
            </Box>
        </Box>
    )
}

export default PageNotFoundScreen
