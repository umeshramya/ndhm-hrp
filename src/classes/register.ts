import request from "request"
import Request from "./request";

export default class Register {
    private clientID: string;
    private clinetSecrete: string;
    private baseUrl: string;

    constructor(_cleintId: string, _clientSecrete: string, _baseUrl?: string ) {
        this.clientID = _cleintId;
        this.clinetSecrete = _clientSecrete;
        // this.baseUrl = _baseUrl;
        // this code had to be changed in prodcution
        this.baseUrl = process.env.REGISTER_BASE_URL_NDHM  || `https://dev.abdm.gov.in/`
    
    }

    /**
     * 
     * @returns return access token in promise
     */
    getAccessToken = async (): Promise<any> => {
        const body = {
            "clientId": this.clientID,
            "clientSecret": this.clinetSecrete
        }

        const url = `${this.baseUrl}v0.5/sessions` 
        const headers = {
            "Content-Type": "application/json"
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
        await this.updateHealthcareUrl(accesstoken, config.endpointUrl)

        await this.registerFacility(accesstoken,
            {
                "active": true,
                "alias": ["Eg"],
                "id": config.facilityId,
                "name": config.facilityName,
                "type": config.facilityType
            })
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