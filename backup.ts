import moment from "moment";
import { v4 as uuidv4 } from 'uuid';
import axios  from "axios";

export default class Patient {
    private baseUrl: string;
    constructor(_baseUrl: string) {
        this.baseUrl = _baseUrl
    }

    hipVerifyPatinetByHealthId = async (accessToken: string, healthId: string, hipId: string, hipType: string): Promise<any> => {
        const url = `${this.baseUrl}v0.5/users/auth/fetch-modes`;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "X-CM-ID": "sbx"
        }
        const requestBody = {
            "requestId": uuidv4(),
            "timestamp":  new Date().toISOString(),
            "query": {
                "id": healthId,
                "purpose": "LINK",
                "requester": {
                    "type": hipType,
                    "id": hipId
                }

            }
        }

        const body = JSON.stringify(requestBody)
        try {
            const response = await fetch(url, {
                headers: headers,
                body: body,
                method: "POST"
            });
            console.log(response.status);
            const text = await response.text();
            return { body: text, statusCode: response.status };
        } catch (err) {
            return Promise.reject(err);
        }

        }

    }