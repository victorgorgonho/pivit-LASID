const crypto = require('crypto');
const secret = require('../../../config/auth.json');

const DADOS_CRIPTOGRAFAR = {
    algoritmo : "aes-256-cbc",
    tipo: "hex",
    segredo : secret.secret,
    iv : crypto.randomBytes(16)
};

module.exports = {
    encrypt(data) {
        let cipher = crypto.createCipheriv(DADOS_CRIPTOGRAFAR.algoritmo, Buffer.from(DADOS_CRIPTOGRAFAR.segredo), DADOS_CRIPTOGRAFAR.iv);
        let encrypted = cipher.update(data);

        encrypted = Buffer.concat([encrypted, cipher.final()]);
        console.log(encrypted.toString(DADOS_CRIPTOGRAFAR.tipo));
        return { iv: DADOS_CRIPTOGRAFAR.iv.toString(DADOS_CRIPTOGRAFAR.tipo), data: encrypted.toString(DADOS_CRIPTOGRAFAR.tipo) };
    },

    decrypt(data, data_iv) {
        let iv = Buffer.from(data_iv, DADOS_CRIPTOGRAFAR.tipo);
        let encryptedText = Buffer.from(data, DADOS_CRIPTOGRAFAR.tipo);
        let decipher = crypto.createDecipheriv(DADOS_CRIPTOGRAFAR.algoritmo, Buffer.from(DADOS_CRIPTOGRAFAR.segredo), iv);
        let decrypted = decipher.update(encryptedText);

        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
};