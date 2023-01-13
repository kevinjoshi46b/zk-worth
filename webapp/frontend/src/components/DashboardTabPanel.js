import { useState } from "react"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { shortner } from "../utils/walletAddressShortner.js"
import Tooltip from "@mui/material/Tooltip"
import Chip from "@mui/material/Chip"
import { Typography } from "@mui/material"
import Button from "@mui/material/Button"
import { useTheme } from "@mui/material/styles"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import Box from "@mui/material/Box"

function DashboardTabPanel({ data }) {
    const theme = useTheme()
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const columns = [
        { id: "cryptoName", label: "Coin/Token Name" },
        { id: "quantity", label: "Quantity" },
    ]

    let accordions = []

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    for (let [key, qvalue] of Object.entries(data.quantity)) {
        accordions.push(
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>{key}</Typography>
                </AccordionSummary>
                <AccordionDetails>
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
                                {qvalue
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
                                                            >
                                                                {value}
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
                        count={qvalue.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </AccordionDetails>
            </Accordion>
        )
    }

    return (
        <>
            <Box
                sx={{
                    m: "6px",
                    my: "10px",
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                <Typography sx={{ fontWeight: "bold" }}>
                    Wallet Address:{" "}
                </Typography>
                <Tooltip title={data.walletAddress}>
                    <Button
                        sx={{
                            cursor: "default",
                            "&.MuiButtonBase-root:hover": {
                                bgcolor: "transparent",
                            },
                            color:
                                theme.palette.mode === "dark"
                                    ? "#FFFFFF"
                                    : "#000000",
                            mr: "6px",
                            pt: "2px",
                        }}
                    >
                        {shortner(data.walletAddress)}
                    </Button>
                </Tooltip>
                {data.type == "primary" ? (
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
            <Typography sx={{ m: "6px", my: "14px", fontWeight: "bold" }}>
                Networks:
            </Typography>
            {accordions}
        </>
    )
}

export default DashboardTabPanel
