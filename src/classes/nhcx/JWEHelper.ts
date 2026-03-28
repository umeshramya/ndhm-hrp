import jose from "node-jose";
import { HcxProtectedHeaders } from "./interfaces";
const { JWK, JWE, parse } = jose;




export default class JWEHelper {
  static async encrypt(options:{
    cert:string,
    headers:HcxProtectedHeaders,
    payload:any,
  }) {

    var keyData;
    if (options.cert.startsWith("-----BEGIN CERTIFICATE-----")) {
      keyData = options.cert;
    } else {
      // keyData = await (await axios.default.get(cert)).data;
    }

    // if (!(keyData && options.headers && options.payload)) throw new Error("Invalid Input");
    if (!(keyData && options.headers )) throw new Error("Invalid Input");
    let key = await JWK.asKey(keyData, "pem");
    const buffer = Buffer.from(JSON.stringify(options.payload));
    const fields = { alg : "RSA-OAEP-256", ...options.headers };
    const encrypted = await JWE.createEncrypt(
      {
        "format" : "compact",
        "contentAlg" : "A256GCM",
        fields : fields
      },
      key
    )
      .update(buffer)
      .final();

  
    return encrypted;
  }


  static async decrypt(option: { cert: string; payload: string }) {
    const keyData = option.cert;
  
    if (!keyData.startsWith("-----BEGIN PRIVATE KEY-----")) {
      throw new Error("Invalid private key provided");
    }
  
    // Convert the private key to a JWK key object
    const privateKey = await JWK.asKey(keyData, "pem");
  
    try {
      // Parse and decrypt the payload using the private key directly
      const decrypted = await JWE.createDecrypt(privateKey).decrypt(option.payload);
  
      // Extract and parse the decrypted plaintext
      const payloadString = decrypted.plaintext.toString();
      const payloadObject = JSON.parse(payloadString);
      return payloadObject;
    } catch (error) {
      console.error("Decryption failed:", error);
      throw error;
    }
  }
  
}


