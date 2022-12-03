import { IPFS_TOKEN } from "../env.js"
// import { Readable } from "stream"
import { Web3Storage } from 'web3.storage'

const getAccessToken = () => IPFS_TOKEN

const makeStorageClient = () => new Web3Storage({ token: getAccessToken() })

const upload = async (fileName, fileContent) => {
    try {
        // const readableStream = Readable.from(Buffer.from(fileContent))
        // readableStream.path = fileName

        const files = [
            new File([Buffer.from(fileContent)], fileName)
        ]

        const client = makeStorageClient()
        const cid = client.put(files)

        return { success: true, cid }
    } catch (error) {
        return { success: false, error }
    }
}

export { upload }
