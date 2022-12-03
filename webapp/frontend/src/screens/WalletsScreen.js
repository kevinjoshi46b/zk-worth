import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import { useTheme } from "@mui/material/styles"
import LinkOffIcon from "@mui/icons-material/LinkOff"
import Chip from "@mui/material/Chip"
import Tooltip from "@mui/material/Tooltip"
import Button from "@mui/material/Button"
import AddLinkIcon from "@mui/icons-material/AddLink"
import Skeleton from "@mui/material/Skeleton"

import { shortner } from "../utils/walletAddressShortner"
import Drawer from "../components/Drawer"
import Topbar from "../components/Topbar"

const WalletsScreen = ({ drawerWidth }) => {
    const theme = useTheme()
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    const columns = [
        { id: "walletAddress", label: "Wallet Address" },
        { id: "action", label: "", align: "right" },
    ]

    const [walletsData, setWalletsData] = useState(null)

    // Update this to fetch user wallets
    useEffect(() => {
        setTimeout(() => {
            setWalletsData([
                {
                    type: "primary",
                    walletAddress: "0x707Vu8kHRMZBN4KF18lFr11Cb",
                },
                {
                    type: "secondary",
                    walletAddress: "0x847RAabTa1QtTX17DbU4p1x23",
                },
                {
                    type: "secondary",
                    walletAddress: "0x7319ybchYF1wSKPRgTBpY444p",
                },
                {
                    type: "secondary",
                    walletAddress: "0x912kWsdo6UXE7UVHrhS95xy64",
                },
            ])
        }, 3000)
    }, [])

    return (
        <Box>
            {/* Top Bar */}
            <Topbar
                pageType="Wallets"
                drawerWidth={drawerWidth}
                handleDrawerToggle={handleDrawerToggle}
            />

            {/* Drawer */}
            <Drawer
                drawerWidth={drawerWidth}
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
                pageType="Wallets"
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
                        display: "flex",
                        justifyContent: "end",
                        mb: "22px",
                    }}
                >
                    {/* Link to the add wallet page/functionality */}
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddLinkIcon />}
                    >
                        Link Wallet
                    </Button>
                </Box>
                <Box
                    sx={{
                        width: "100%",
                        backgroundColor:
                            theme.palette.mode === "dark"
                                ? "#1E1E1E"
                                : "#F5F5F5",
                        borderRadius: 4,
                        p: "20px",
                        pb: "6px",
                    }}
                >
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
                            {walletsData == null ? (
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <Box>
                                                <Skeleton
                                                    variant="rounded"
                                                    width={200}
                                                    height={40}
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right"></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Box>
                                                <Skeleton
                                                    variant="rounded"
                                                    width={200}
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
                                                    width={200}
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
                                </TableBody>
                            ) : (
                                <TableBody>
                                    {walletsData
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
                                                                row[column.id]
                                                            return (
                                                                <TableCell
                                                                    key={index}
                                                                    align={
                                                                        column.align
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
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                    {column.id ==
                                                                        "action" &&
                                                                    row.type !=
                                                                        "primary" ? (
                                                                        // Link to unlink wallet page/functionality will be added here
                                                                        <Button
                                                                            variant="contained"
                                                                            color="error"
                                                                            startIcon={
                                                                                <LinkOffIcon />
                                                                            }
                                                                        >
                                                                            Unlink
                                                                        </Button>
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
                            )}
                        </Table>
                    </TableContainer>
                    {walletsData == null ? (
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
                                sx={{ mt: "14px", mr: "18px", mb: "16px" }}
                            />
                        </Box>
                    ) : (
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 15, 20, 25]}
                            component="div"
                            count={walletsData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    )}
                </Box>
            </Box>
        </Box>
    )
}

export default WalletsScreen
