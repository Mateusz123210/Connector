import { Buffer } from 'buffer/'


class AESEncryptor{

    encryptSymmetric = async (plaintext: string, key: string, initialization_vector: string) => {

        const iv = new TextEncoder().encode(initialization_vector);

        const encodedPlaintext = new TextEncoder().encode(plaintext);
        var enc = new TextEncoder();
        const rawKey = enc.encode(key)

        const secretKey = await window.crypto.subtle.importKey('raw', rawKey, {
            name: 'AES-GCM',
            length: 256
        }, true, ['encrypt', 'decrypt']);

        const ciphertext = await window.crypto.subtle.encrypt({
            name: 'AES-GCM',
            iv
        }, secretKey, encodedPlaintext);

        return ({
            ciphertext: Buffer.from(ciphertext).toString('base64'),
            iv: Buffer.from(iv).toString('base64')
        });
      }

      decryptSymmetric = async (ciphertext: string, key: string, initialization_vector: string) => {
        const iv = new TextEncoder().encode(initialization_vector);

        var enc = new TextEncoder();
        const rawKey = enc.encode(key)
        const secretKey = await window.crypto.subtle.importKey(
            'raw',
            rawKey, 
            {
            name: 'AES-GCM',
            length: 256
        }, true, ['encrypt', 'decrypt']);

        const cleartext = await window.crypto.subtle.decrypt({
            name: 'AES-GCM',
            iv: iv,
        }, secretKey, Buffer.from(ciphertext, 'base64'));

        return new TextDecoder().decode(cleartext);
      }

    importSecretKey = (rawKey: any) => {
        return window.crypto.subtle.importKey("raw", rawKey, "AES-GCM", true, [
          "encrypt",
          "decrypt",
        ]);
      }

}
export default new AESEncryptor()