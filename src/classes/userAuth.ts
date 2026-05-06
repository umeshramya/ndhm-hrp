
import { v4 as uuidv4 } from 'uuid';
import Request from "./request";
import Header from "./header";

type Purpose = "KYC_AND_LINK" | "KYC" | "LINK"


export default class UserAuth extends Header{
    constructor(_baseUrl: string, _accessToken: string) {
        super(_baseUrl, _accessToken)
    }

    fetchModes= async (config: { healthId: string, hipId: string, hipType: string, purpose: Purpose }): Promise<any> => {
        const headers = this.headers(config.healthId)
        const url = `${this.baseUrl}/hiecm/gateway/v0.5/users/auth/fetch-modes`;
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
            "headers": headers, "method": "POST", "requestBody": body, "url": url
        })

        return body;
    }


    init = async (config: { healthId: string, hipId: string, hipType: string, purpose: Purpose, authMode: "MOBILE_OTP" | "DEMOGRAPHICS" | "AADHAAR_OTP" }): Promise<any> => {
        
        const headers = this.headers(config.healthId)
        const url = `${this.baseUrl}/hiecm/gateway/v0.5/users/auth/init`

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
            "headers": headers, "method": "POST", "requestBody": body, "url": url
        })
        return body;
    }


    confirm = async (config: { healthId:string, transactionId: string, authCode?: string , demographic?: {
        "name": string,
        "gender": string,
        "dateOfBirth": string,
        "identifier": {
          "type": "MOBILE",
          "value": string
        }
    } }) => {
        const headers = this.headers(config.healthId)
        const url = `${this.baseUrl}/hiecm/gateway/v0.5/users/auth/confirm`


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
            "headers":  headers, "method": "POST", "requestBody": body, "url": url
        })

        return body

    }



}