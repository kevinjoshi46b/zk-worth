import React from "react"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import { useTheme } from "@mui/material/styles"
import DrawerItems from "./DrawerItems"

function ResponsiveDrawer({
    window,
    drawerWidth,
    mobileOpen,
    handleDrawerToggle,
    pageType,
}) {
    const theme = useTheme()

    const container =
        window !== undefined ? () => window().document.body : undefined

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
            <Drawer
                container={container}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: "block", sm: "none" },
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: drawerWidth,
                        borderWidth: "0",
                    },
                }}
                PaperProps={{
                    sx: {
                        backgroundColor:
                            theme.palette.mode === "dark"
                                ? "#000000"
                                : "#E0E0E0",
                    },
                }}
                disableScrollLock={ true }
            >
                <DrawerItems pageType={pageType} />
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: "none", sm: "block" },
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: drawerWidth,
                        borderWidth: "0",
                    },
                }}
                PaperProps={{
                    sx: {
                        backgroundColor:
                            theme.palette.mode === "dark"
                                ? "#1E1E1E"
                                : "#F5F5F5",
                    },
                }}
                open
            >
                <DrawerItems pageType={pageType} />
            </Drawer>
        </Box>
    )
}

export default ResponsiveDrawer
