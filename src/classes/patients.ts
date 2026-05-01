import Header from "./header";
import { v4 as uuidv4 } from "uuid";
import Request from "./request";

type requesterType = "HIU"| "HIP"
export interface PATIENT_FIND {
  requestId: string
  timestamp: string
  query: {
    patient:  {
      id: string
    }
    
    requester: {
      type:  requesterType
      id: string
    }
  }
}



export default class Patients extends Header {
  constructor(_baseUrl: string, _accessToken: string) {
    super(_baseUrl, _accessToken);
  }
  /**
   * Sends an SMS notification to a patient about linked care contexts using the v3 HIE-CM endpoint.
   *
   * This replaces the deprecated v0.5 `smsNotify2` endpoint. It requires the v3 inline header
   * pattern (REQUEST-ID, TIMESTAMP, X-CM-ID) and sends a simplified notification payload
   * containing the patient's phone number and HIP details.
   *
   * Headers are built inline following the existing v3 pattern used by `generateToken` and `addCareContext`.
   *
   * @param config - Configuration object
   * @param config.healthId - Patient's health ID used to derive X-CM-ID header (e.g., "unknown@sbx" or "unknown@abdm")
   * @param config.phoneNo - Patient's phone number for SMS notification
   * @param config.hipName - Display name of the Health Information Provider (HIP)
   * @param config.hipId - HIP identifier (e.g., "IN2910000004")
   * @param config.requestId - Optional UUID for REQUEST-ID header and body (auto-generated if omitted)
   * @param config.timestamp - Optional ISO timestamp for TIMESTAMP header and body (auto-generated if omitted)
   * @returns The parsed API response
   */
  smsNotify2 = async (config: {
    healthId: "unknown@sbx" | "unknown@abdm";
    phoneNo: string;
    hipName: string;
    hipId: string;
    requestId?: string;
    timestamp?: string;
  }) => {
    this.setXCmId(config.healthId);
    const requestId = config.requestId ?? uuidv4();
    const timestamp = config.timestamp ?? new Date().toISOString();
    const headers = {
      "REQUEST-ID": requestId,
      TIMESTAMP: timestamp,
      "X-CM-ID": this.xCmId,
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.accessToken}`,
    };
    const url = `${this.baseUrl}/api/hiecm/hip/v3/link/patient/links/sms/notify2`;
    const body = {
      requestId,
      timestamp,
      notification: {
        phoneNo: config.phoneNo,
        hip: {
          name: config.hipName,
          id: config.hipId,
        },
      },
    };

    const response = await new Request().request({
      headers,
      method: "POST",
      requestBody: body,
      url,
    });

    return JSON.parse(response.body);
  };

  /**
   * This API is meant for identify to patient given her consent-manager-user-id
   * @param config 
   * @param healthId 
   * @returns 
   */
  find = async (
    config: PATIENT_FIND,
    healthId: string
  ) => {
    try {
      const headers = this.headers(healthId);
      const url = `${this.baseUrl}v0.5/patients/find`;
      const body: PATIENT_FIND = {
        ...config,
        requestId: uuidv4(),
        timestamp: new Date().toISOString(),
      };

      const res = await new Request().request({
        headers: headers,
        method: "POST",
        requestBody: body,
        url: url,
      });

      return body;
    } catch (error) {
      console.log(error);
    }
  };

  



}
