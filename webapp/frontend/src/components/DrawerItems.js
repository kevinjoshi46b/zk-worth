import React from "react"
import Box from "@mui/material/Box"
import { Link } from "react-router-dom"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded"
import WalletRoundedIcon from "@mui/icons-material/WalletRounded"
import CompareArrowsRoundedIcon from "@mui/icons-material/CompareArrowsRounded"
import GitHubIcon from "@mui/icons-material/GitHub"
import Brightness4Icon from "@mui/icons-material/Brightness4"
import Brightness7Icon from "@mui/icons-material/Brightness7"
import { IconButton, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { ColorModeContext } from "../App"
import logo from "../logo.png"

const DrawerItems = ({ pageType }) => {
    const theme = useTheme()
    const toggleColorMode = React.useContext(ColorModeContext)

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
            }}
        >
            <Box>
                <Link to="/">
                    <img
                        src={logo}
                        alt="Logo"
                        style={{
                            width: 60,
                            height: 60,
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                            marginTop: "20px",
                            marginBottom: "16px",
                        }}
                    />
                </Link>
                <List>
                    <Link
                        to="/dashboard"
                        style={{
                            color: "inherit",
                            textDecoration: "inherit",
                        }}
                    >
                        <ListItem key="Dashboard" disablePadding>
                            {pageType === "Dashboard" ? (
                                <ListItemButton
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        paddingRight: "0",
                                        paddingY: "20px",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: "40px" }}>
                                            <DashboardRoundedIcon color="primary" />
                                        </ListItemIcon>
                                        <Typography
                                            style={{
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Dashboard
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "block",
                                            backgroundColor:
                                                theme.palette.mode === "dark"
                                                    ? "#90CAF9"
                                                    : "#1976D2",
                                            paddingX: "1px",
                                            paddingY: "12px",
                                        }}
                                    ></Box>
                                </ListItemButton>
                            ) : (
                                <ListItemButton sx={{ paddingY: "20px" }}>
                                    <ListItemIcon sx={{ minWidth: "40px" }}>
                                        <DashboardRoundedIcon color="disabled" />
                                    </ListItemIcon>
                                    <Typography color="textSecondary">
                                        Dashboard
                                    </Typography>
                                </ListItemButton>
                            )}
                        </ListItem>
                    </Link>
                    <Link
                        to="/wallets"
                        style={{
                            color: "inherit",
                            textDecoration: "inherit",
                        }}
                    >
                        <ListItem key="Wallets" disablePadding>
                            {pageType === "Wallets" ? (
                                <ListItemButton
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        paddingRight: "0",
                                        paddingY: "20px",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: "40px" }}>
                                            <WalletRoundedIcon color="primary" />
                                        </ListItemIcon>
                                        <Typography
                                            style={{
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Wallets
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "block",
                                            backgroundColor:
                                                theme.palette.mode === "dark"
                                                    ? "#90CAF9"
                                                    : "#1976D2",
                                            paddingX: "1px",
                                            paddingY: "12px",
                                        }}
                                    ></Box>
                                </ListItemButton>
                            ) : (
                                <ListItemButton sx={{ paddingY: "20px" }}>
                                    <ListItemIcon sx={{ minWidth: "40px" }}>
                                        <WalletRoundedIcon color="disabled" />
                                    </ListItemIcon>
                                    <Typography color="textSecondary">
                                        Wallets
                                    </Typography>
                                </ListItemButton>
                            )}
                        </ListItem>
                    </Link>
                    <Link
                        to="/requests"
                        style={{
                            color: "inherit",
                            textDecoration: "inherit",
                        }}
                    >
                        <ListItem key="Requests" disablePadding>
                            {pageType === "Requests" ? (
                                <ListItemButton
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        paddingRight: "0",
                                        paddingY: "20px",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: "40px" }}>
                                            <CompareArrowsRoundedIcon color="primary" />
                                        </ListItemIcon>
                                        <Typography
                                            style={{
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Requests
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "block",
                                            backgroundColor:
                                                theme.palette.mode === "dark"
                                                    ? "#90CAF9"
                                                    : "#1976D2",
                                            paddingX: "1px",
                                            paddingY: "12px",
                                        }}
                                    ></Box>
                                </ListItemButton>
                            ) : (
                                <ListItemButton sx={{ paddingY: "20px" }}>
                                    <ListItemIcon sx={{ minWidth: "40px" }}>
                                        <CompareArrowsRoundedIcon color="disabled" />
                                    </ListItemIcon>
                                    <Typography color="textSecondary">
                                        Requests
                                    </Typography>
                                </ListItemButton>
                            )}
                        </ListItem>
                    </Link>
                </List>
            </Box>
            <Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        mb: "24px",
                    }}
                >
                    <a
                        href="https://github.com/K-B-J/zk-crypto-net-worth"
                        target="_blank"
                    >
                        <IconButton
                            size="large"
                            sx={{ border: 1, borderRadius: 4, opacity: "0.5" }}
                        >
                            <GitHubIcon />
                        </IconButton>
                    </a>
                    <IconButton
                        size="large"
                        sx={{ border: 1, borderRadius: 4, opacity: "0.5" }}
                        onClick={toggleColorMode}
                    >
                        {theme.palette.mode === "dark" ? (
                            <Brightness7Icon />
                        ) : (
                            <Brightness4Icon />
                        )}
                    </IconButton>
                </Box>
                <Typography
                    variant="subtitle2"
                    sx={{ mb: "10px", textAlign: "center" }}
                    color="textSecondary"
                >
                    © All Rights Reserved
                </Typography>
            </Box>
        </Box>
    )
}

export default DrawerItems
