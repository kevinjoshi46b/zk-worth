export const shortner = (address) => {
    return (
        address.slice(0, 6) +
        "..." +
        address.slice(address.length - 6, address.length)
    )
}
