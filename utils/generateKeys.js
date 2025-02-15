const crypto = require('crypto');

// Generate RSA keys
const generateKeys = () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: 'your-encryption-passphrase', // Keep this secure
        },
    });

    return { publicKey, privateKey };
};
