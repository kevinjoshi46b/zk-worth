import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import AppBar from "@mui/material/AppBar"
import IconButton from "@mui/material/IconButton"
import Toolbar from "@mui/material/Toolbar"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Fade from "@mui/material/Fade"
import Divider from "@mui/material/Divider"
import Avatar from "@mui/material/Avatar"
import Tooltip from "@mui/material/Tooltip"
import MenuIcon from "@mui/icons-material/Menu"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import LogoutIcon from "@mui/icons-material/Logout"
import { Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"
import { shortner } from "../utils/walletAddressShortner"

const Topbar = ({ pageType, drawerWidth, handleDrawerToggle }) => {
    const theme = useTheme()
    const [cookies, createCookie, removeCookie] = useCookies([])
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const logout = () => {
        removeCookie("Auth", { path: "/" })
        navigate("/", { replace: true })
    }

    useEffect(() => {
        if (!cookies.Auth) return navigate("/", { replace: true })
    }, [])

    return (
        <Box>
            {/* Mobile */}
            <AppBar
                position="absolute"
                sx={{
                    display: { sm: "none" },
                    backgroundColor:
                        theme.palette.mode === "dark" ? "" : "#E0E0E0",
                }}
            >
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <IconButton
                            color="default"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{
                                mr: 1,
                                display: { sm: "none" },
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        {pageType === "NotFound" ? (
                            ""
                        ) : (
                            <Typography
                                variant="h5"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    color:
                                        theme.palette.mode === "light"
                                            ? "black"
                                            : "inherit",
                                }}
                            >
                                {pageType}
                            </Typography>
                        )}
                    </Box>
                    {pageType === "NotFound" ? (
                        ""
                    ) : (
                        <>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    cursor: "pointer",
                                    alignItems: "center",
                                }}
                                id="fade-button"
                                aria-controls={open ? "fade-menu" : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                                onClick={handleClick}
                            >
                                <Box
                                    sx={{
                                        display: "block",
                                        backgroundColor:
                                            theme.palette.mode === "dark"
                                                ? "#1E1E1E"
                                                : "#F5F5F5",
                                        padding: "5px",
                                        borderRadius: 20,
                                        mr: "4px",
                                    }}
                                >
                                    <Avatar
                                        alt="Display Picture"
                                        src="/avatar/default.png"
                                        sx={{
                                            height: 32,
                                            width: 32,
                                        }}
                                    />
                                </Box>
                                <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                            </Box>
                            <Menu
                                sx={{ display: { sm: "none" } }}
                                id="fade-menu"
                                MenuListProps={{
                                    "aria-labelledby": "fade-button",
                                }}
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                TransitionComponent={Fade}
                            >
                                <MenuItem
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "start",
                                        paddingTop: 0,
                                        cursor: "default",
                                        "&.MuiButtonBase-root:hover": {
                                            bgcolor: "transparent",
                                        },
                                    }}
                                >
                                    <Typography sx={{ fontSize: "12px" }}>
                                        Username:
                                    </Typography>
                                    <Typography sx={{ fontSize: "18px" }}>
                                        {cookies.Auth
                                            ? cookies.Auth.username
                                            : ""}
                                    </Typography>
                                </MenuItem>
                                <MenuItem
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "start",
                                        paddingTop: 0,
                                        paddingBottom: "6px",
                                        cursor: "default",
                                        "&.MuiButtonBase-root:hover": {
                                            bgcolor: "transparent",
                                        },
                                    }}
                                >
                                    <Typography sx={{ fontSize: "12px" }}>
                                        Wallet Address:
                                    </Typography>
                                    {cookies.Auth ? (
                                        <Tooltip
                                            title={cookies.Auth.walletAddress}
                                        >
                                            <Typography
                                                sx={{ fontSize: "18px" }}
                                            >
                                                {shortner(
                                                    cookies.Auth.walletAddress
                                                )}
                                            </Typography>
                                        </Tooltip>
                                    ) : (
                                        ""
                                    )}
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={logout}>
                                    <LogoutIcon sx={{ mr: "6px" }}></LogoutIcon>{" "}
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            {/* Desktop */}
            <Box
                position="absolute"
                sx={{
                    display: { xs: "none", sm: "flex" },
                    justifyContent: "space-between",
                    pl: `calc(${drawerWidth}px + 48px)`,
                    pr: "48px",
                    pt: "30px",
                    width: "100%",
                }}
            >
                {pageType === "NotFound" ? (
                    ""
                ) : (
                    <>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: "700",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            {pageType}
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                cursor: "pointer",
                                alignItems: "center",
                            }}
                            id="fade-button"
                            aria-controls={open ? "fade-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={handleClick}
                        >
                            <Box
                                sx={{
                                    display: "block",
                                    backgroundColor:
                                        theme.palette.mode === "dark"
                                            ? "#1E1E1E"
                                            : "#F5F5F5",
                                    padding: "5px",
                                    borderRadius: 20,
                                    mr: "4px",
                                }}
                            >
                                <Avatar
                                    alt="Display Picture"
                                    src="/avatar/default.png"
                                    sx={{
                                        height: 36,
                                        width: 36,
                                    }}
                                />
                            </Box>
                            <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                        </Box>
                        <Menu
                            sx={{ display: { xs: "none", sm: "block" } }}
                            id="fade-menu"
                            MenuListProps={{
                                "aria-labelledby": "fade-button",
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            TransitionComponent={Fade}
                        >
                            <MenuItem
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "start",
                                    paddingTop: 0,
                                    cursor: "default",
                                    "&.MuiButtonBase-root:hover": {
                                        bgcolor: "transparent",
                                    },
                                }}
                            >
                                <Typography sx={{ fontSize: "12px" }}>
                                    Username:
                                </Typography>
                                <Typography sx={{ fontSize: "18px" }}>
                                    {cookies.Auth ? cookies.Auth.username : ""}
                                </Typography>
                            </MenuItem>
                            <MenuItem
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "start",
                                    paddingTop: 0,
                                    paddingBottom: "6px",
                                    cursor: "default",
                                    "&.MuiButtonBase-root:hover": {
                                        bgcolor: "transparent",
                                    },
                                }}
                            >
                                <Typography sx={{ fontSize: "12px" }}>
                                    Wallet Address:
                                </Typography>
                                {cookies.Auth ? (
                                    <Tooltip title={cookies.Auth.walletAddress}>
                                        <Typography sx={{ fontSize: "18px" }}>
                                            {shortner(
                                                cookies.Auth.walletAddress
                                            )}
                                        </Typography>
                                    </Tooltip>
                                ) : (
                                    ""
                                )}
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={logout}>
                                <LogoutIcon sx={{ mr: "6px" }}></LogoutIcon>{" "}
                                Logout
                            </MenuItem>
                        </Menu>
                    </>
                )}
            </Box>
        </Box>
    )
}

export default Topbar
