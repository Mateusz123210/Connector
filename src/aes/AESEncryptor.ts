import crypto from "crypto"
import { Buffer } from 'buffer/'



class AESEncryptor{
    // algorithm = 'aes-256-cbc';


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


    encrypt = async (message: string, key: string, initialization_vector: string) => {
        var enc = new TextEncoder();
        var iv = enc.encode(initialization_vector)
        const data = enc.encode(message)
        const rawKey = enc.encode(key)
        const importedKey =  await window.crypto.subtle.importKey("raw", rawKey, "AES-GCM", true, [
            "encrypt",
            "decrypt",
          ]);


        console.log(typeof iv)
        console.log(iv)
        console.log(typeof data)
        console.log(data)
        console.log(typeof rawKey)
        console.log(rawKey)
        console.log(typeof importedKey)
        console.log(importedKey)
        

        const encrypted =  window.crypto.subtle.encrypt(
	    {
	        name: "AES-GCM",

	        //Don't re-use initialization vectors!
	        //Always generate a new iv every time your encrypt!
	        //Recommended to use 12 bytes length
	        iv: iv,

	        //Additional authentication data (optional)
	        // additionalData: ArrayBuffer,

	        //Tag length (optional)
	        tagLength: 128, //can be 32, 64, 96, 104, 112, 120 or 128 (default)
	    },
	    importedKey, //from generateKey or importKey above
	    data //ArrayBuffer of data you want to encrypt
	)
    var enc1 = new TextDecoder("utf-8");
    var dec_enc = enc1.decode(await encrypted)
    return dec_enc



    }


    hexToDecimal(h: string): number {
        return parseInt(h, 16);
    }

    hex2ab(hex: any): Uint8Array {
        return new Uint8Array(hex.match(/[\da-f]{2}/gi).map((h: string) => this.hexToDecimal(h)));
    }

    decrypt = async (ciphertext: string, key: string, initialization_vector: string) => {
        var enc = new TextEncoder();
        var iv = enc.encode(initialization_vector)
        const data = this.hex2ab(ciphertext)
        const rawKey = enc.encode(key)
        const importedKey = await this.importSecretKey(rawKey)


        // console.log(typeof iv)
        // console.log(iv)
        // console.log(typeof data)
        // console.log(data)
        // console.log(typeof rawKey)
        // console.log(rawKey)
        // console.log(typeof importedKey)
        // console.log(importedKey)


        // const decrypted = window.crypto.subtle.decrypt(
        //     {
        //         name: "AES-GCM",
        //         iv: iv, //The initialization vector you used to encrypt
        //         //additionalData: ArrayBuffer, //The addtionalData you used to encrypt (if any)
        //         tagLength: 128, //The tagLength you used to encrypt (if any)
        //     },
        //     importedKey, //from generateKey or importKey above
        //     data //ArrayBuffer of the data
        // )



        // var enc1 = new TextDecoder("utf-8");
        // var dec_enc = enc1.decode(await decrypted)
        // const decipher = crypto.createDecipheriv(this.algorithm, key, initialization_vector);
        // let decrypted = decipher.update(message, 'hex', 'utf-8');
        // decrypted += decipher.final('utf-8');
        // return decrypted;
    };

}
export default new AESEncryptor()