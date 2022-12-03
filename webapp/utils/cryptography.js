import crypto from "crypto"

export function genKeys() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        // The standard secure default length for RSA keys is 2048 bits
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        }
    })
    return [publicKey, privateKey];
}

export function encrypt(publicKey, plaintext) {
    let buff = Buffer.from(plaintext);
    const encryptedData = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        Buffer.from(buff)
    )
    return encryptedData.toString("base64");
}

export function decrypt(privateKey, ciphertext) {

    let buff = Buffer.from(ciphertext, "base64");
    const decryptedData = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        buff
    )
    return decryptedData.toString();
}
