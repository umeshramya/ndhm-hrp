import { v4 as uuidv4 } from "uuid";
import Request from "./request";

export default class Register {
    private clientID: string;
    private clinetSecrete: string;
    private baseUrl: string;

    constructor(_cleintId: string, _clientSecrete: string, _baseUrl?: string ) {
        this.clientID = _cleintId;
        this.clinetSecrete = _clientSecrete;
        this.baseUrl = process.env.REGISTER_BASE_URL_NDHM || `https://dev.abdm.gov.in`
    }

    /**
     * Obtain a V3 session token from ABDM gateway.
     * POST {baseUrl}/api/hiecm/gateway/v3/sessions
     */
    getAccessToken = async (): Promise<any> => {
        const body = {
            "clientId": this.clientID,
            "clientSecret": this.clinetSecrete,
            "grantType": "client_credentials"
        }

        const url = `${this.baseUrl}/api/hiecm/gateway/v3/sessions`
        const headers = {
            "Content-Type": "application/json",
            "REQUEST-ID": uuidv4(),
            "TIMESTAMP": new Date().toISOString(),
            "X-CM-ID": process.env.NDHM_X_CM_ID || "sbx"
        }

        return new Request().request({
            "headers": headers, "url": url, "requestBody": body, "method": "POST"
        }).then(res => res.body)

    }

    /**
     * 
     * @param accessToken access token
     * @param endPointUrl this HIP endpoint URL
     * @returns Promise
     */
    updateHealthcareUrl = async (accessToken: string, endPointUrl: string): Promise<any> => {
        const url = `${this.baseUrl}devservice/v1/bridges`
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
        const body = { url: endPointUrl }

        return new Request().request({
            "headers": headers, "requestBody": body, method: "PATCH", "url": url
        })

    }

    /**
     * 
     * @param accessToken accessToken
     * @param config config for organization
     * @returns Promise
     */
    registerFacility = async (accessToken: string, config: {
        "id": string;
        "name": string
        "type": string
        "active": boolean
        "alias": any
    }): Promise<any> => {
        const body = config

        const url = `${this.baseUrl}devservice/v1/bridges/services`

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }


        return new Request().request({
            "headers": headers, "requestBody": body, method: "PUT", "url": url
        })



    }

    registerAndGetAccessToken = async (config: {
        endpointUrl: string, facilityId: string, facilityName: string, facilityType: string
    }): Promise<string> => {
        const accesstoken = (await this.getAccessToken().then(res => JSON.parse(res))).accessToken
        // Bridge URL update (updateHealthcareUrl) and facility registration
        // (registerFacility) are one-time setup steps handled through the
        // HSPSBX portal (https://hspsbx.abdm.gov.in/). They are NOT required
        // per session in the M3 flow.
        return accesstoken;
    }


    updatServices = async(accessToken:string,config:{
        id:string;
        name:string;
        type:"HIU" | "HIP";
        active:boolean
        alias : string[]
    }):Promise<any>=>{
        // v1/bridges/addUpdateServices 
        const body = config
        // const url = `${this.baseUrl}devservice/v1/bridges/addUpdateServices`
        const url = `${this.baseUrl}v1/bridges/addUpdateServices`

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
        return new Request().request({
            "headers": headers, "requestBody": body, method: "PUT", "url": url
        })

    }



}