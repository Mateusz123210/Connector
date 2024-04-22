import crypto from "crypto"
import { Buffer } from 'buffer/'



class AESEncryptor{

    encryptSymmetric = async (plaintext: string, key: string, initialization_vector: string) => {
        // create a random 96-bit initialization vector (IV)
        const iv = new TextEncoder().encode(initialization_vector);
      
        // encode the text you want to encrypt
        const encodedPlaintext = new TextEncoder().encode(plaintext);
        var enc = new TextEncoder();
        const rawKey = enc.encode(key)
      
        // prepare the secret key for encryption
        const secretKey = await window.crypto.subtle.importKey('raw', rawKey, {
            name: 'AES-GCM',
            length: 256
        }, true, ['encrypt', 'decrypt']);
      
        // encrypt the text with the secret key
        const ciphertext = await window.crypto.subtle.encrypt({
            name: 'AES-GCM',
            iv
        }, secretKey, encodedPlaintext);
        
        // return the encrypted text "ciphertext" and the IV
        // encoded in base64
        return ({
            ciphertext: Buffer.from(ciphertext).toString('base64'),
            iv: Buffer.from(iv).toString('base64')
        });
      }

      decryptSymmetric = async (ciphertext: string, key: string, initialization_vector: string) => {
        const iv = new TextEncoder().encode(initialization_vector);
      
        // encode the text you want to encrypt
        const encodedCipherText = new TextEncoder().encode(ciphertext);
        // prepare the secret key
        var enc = new TextEncoder();
        const rawKey = enc.encode(key)
        const secretKey = await window.crypto.subtle.importKey(
            'raw',
            rawKey, 
            {
            name: 'AES-GCM',
            length: 256
        }, true, ['encrypt', 'decrypt']);
      
        // decrypt the encrypted text "ciphertext" with the secret key and IV
        const cleartext = await window.crypto.subtle.decrypt({
            name: 'AES-GCM',
            iv: iv,
        }, secretKey, Buffer.from(ciphertext, 'base64'));
      
        // decode the text and return it
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