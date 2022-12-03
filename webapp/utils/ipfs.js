import { IPFS_TOKEN } from "../env.js"
// import { Readable } from "stream"
import { Web3Storage, File } from 'web3.storage'


const upload = async (fileName, fileContent) => {
    try {
        // const readableStream = Readable.from(Buffer.from(fileContent))
        // readableStream.path = fileName

        const files = [
            new File([Buffer.from(fileContent)], fileName)
        ]

        const client = new Web3Storage({ token: IPFS_TOKEN })
        const cid = await client.put(files)

        return { success: true, cid }
    } catch (error) {
        return { success: false, error }
    }
}

export { upload }
