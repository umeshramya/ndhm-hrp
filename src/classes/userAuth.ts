
import { v4 as uuidv4 } from 'uuid';
import Request from "./request";
import Header from "./header";

export default class UserAuth extends Header{
    constructor(_baseUrl: string, _accessToken: string, _xCmId: "sbx" | "ndhm") {
        super(_baseUrl, _accessToken, _xCmId)
    }

    fetchModes= async (config: { healthId: string, hipId: string, hipType: string, purpose: string }): Promise<any> => {
        const url = `${this.baseUrl}gateway/v0.5/users/auth/fetch-modes`;
        const body = {
            "requestId": uuidv4(),
            "timestamp": new Date().toISOString(),
            "query": {
                "id": config.healthId,
                "purpose": config.purpose,
                "requester": {
                    "type": config.hipType,
                    "id": config.hipId
                }

            }
        }

        await new Request().request({
            "headers": this.headers, "method": "POST", "requestBody": body, "url": url
        })

        return body;
    }


    init = async (config: { healthId: string, hipId: string, hipType: string, purpose: string, authMode: "MOBILE_OTP" | "DEMOGRAPHICS" | "AADHAAR_OTP" }): Promise<any> => {
        const url = `${this.baseUrl}gateway/v0.5/users/auth/init`

        const body = {
            "requestId": uuidv4(),
            "timestamp": new Date().toISOString(),
            "query": {
                "id": config.healthId,
                "purpose": config.purpose,
                "authMode": config.authMode,
                "requester": {
                    "type": config.hipType,
                    "id": config.hipId
                }
            }
        }

        await new Request().request({
            "headers": this.headers, "method": "POST", "requestBody": body, "url": url
        })
        return body;
    }


    confirm = async (config: { transactionId: string, authCode?: string , demographic?: {
        "name": string,
        "gender": string,
        "dateOfBirth": string,
        "identifier": {
          "type": "MOBILE",
          "value": string
        }
    } }) => {
        const url = `${this.baseUrl}gateway/v0.5/users/auth/confirm`
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.accessToken}`,
            "X-CM-ID": this.xCmId
        }

        const body = {
            "requestId": uuidv4(),
            "timestamp": new Date().toISOString(),
            "transactionId": config.transactionId,
            "credential": {
                "authCode": config.authCode,
                  "demographic": {
                    "name": config.demographic?.name,
                    "gender": config.demographic?.gender,
                    "dateOfBirth": config.demographic?.dateOfBirth,
                    "identifier": {
                      "type": config.demographic?.identifier.type,
                      "value": config.demographic?.identifier.value
                    }
                  }
            }
        }
        await new Request().request({
            "headers": headers, "method": "POST", "requestBody": body, "url": url
        })

        return body

    }



}