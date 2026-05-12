import Header from "./header";
import { v4 as uuidv4 } from "uuid";
import Request from "./request";

export default class ConsentFlow extends Header {
  constructor(_baseUrl: string, _accessToken: string) {
    super(_baseUrl, _accessToken);
  }
  /**
   * V3: HIP acknowledges consent notification from CM.
   * Called in response to the CM callback POST {cb}/api/v3/consent/request/hip/notify.
   *
   * Endpoint: POST /api/hiecm/consent/v3/request/hip/on-notify
   * Per ABDM M2 Sandbox Documentation v2.8, Section 6.3.2
   *
   * @param config.healthId - ABHA address used to derive X-CM-ID
   * @param config.consentId - Consent ID from the notify callback
   * @param config.callbackRequestId - The requestId from the HIE-CM callback, echoed in response.requestId
   * @param config.requestId - Optional UUID for REQUEST-ID header
   * @param config.timestamp - Optional ISO timestamp for TIMESTAMP header
   * @param config.error - Optional error object { code, message }
   * @returns The request body that was sent
   */
  onhipNotify = async (config: {
    healthId: string;
    consentId: string;
    callbackRequestId: string;
    requestId?: string;
    timestamp?: string;
    error?: {
      code: string;
      message: string;
    };
  }) => {
    try {
      this.setXCmId(config.healthId);
      const headers = {
        "REQUEST-ID": config.requestId ?? uuidv4(),
        TIMESTAMP: config.timestamp ?? new Date().toISOString(),
        "X-CM-ID": this.xCmId,
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      };
      const url = `${this.baseUrl}/api/hiecm/consent/v3/request/hip/on-notify`;

      const body: any = {
        acknowledgement: {
          status: config.error ? "ERROR" : "OK",
          consentId: config.consentId,
        },
        response: {
          requestId: config.callbackRequestId,
        },
      };

      if (config.error) {
        body.error = config.error;
      }

      const res = await new Request().request({
        headers,
        method: "POST",
        requestBody: body,
        url,
      });

      console.log("onhipNotify V3 ABDM response:", res.status, res.statusText, res.body?.slice(0, 500));

      return body;
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * V3: HIU fetches consent artifact from CM.
   * Called after HIU receives consent notification with consentArtefact IDs.
   *
   * Endpoint: POST /api/hiecm/consent/v3/fetch
   *
   * @param config.healthId - ABHA address used to derive X-CM-ID
   * @param config.consentId - Consent artifact ID to fetch
   */
  hiuConsentFetch = async (config: {
    healthId: string;
    consentId: string;
    errCode?: string;
    errMessage?: string;
  }) => {
    try {
      this.setXCmId(config.healthId);
      const headers = {
        "REQUEST-ID": uuidv4(),
        TIMESTAMP: new Date().toISOString(),
        "X-CM-ID": this.xCmId,
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      };
      const url = `${this.baseUrl}/api/hiecm/consent/v3/fetch`;

      const body: any = {
        consentId: config.consentId,
      };

      if (config.errCode) {
        body.error = {
          code: config.errCode,
          message: config.errMessage || "Error occured",
        };
      }

      const res = await new Request().request({
        headers,
        method: "POST",
        requestBody: body,
        url,
      });

      return body;
    } catch (error) {
      console.log(error);
    }
  };


  /**
   * V3: HIU responds to consent notification status from CM.
   * Called when consent is DENIED/EXPIRED/REVOKED to update status.
   *
   * Endpoint: POST /api/hiecm/consent/v3/request/status
   */
  onhiuNotify = async (config: {
    healthId: string;
    acknowledgement: {
      status: "OK" | "UNKNOWN";
      consentId: string;
    }[];
    requestId: string;
    errCode?: string;
    errMessage?: string;
  }) => {
    try {
      this.setXCmId(config.healthId);
      const headers = {
        "REQUEST-ID": uuidv4(),
        TIMESTAMP: new Date().toISOString(),
        "X-CM-ID": this.xCmId,
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      };
      const url = `${this.baseUrl}/api/hiecm/consent/v3/request/hiu/on-notify`;

      const body: any = {
        acknowledgement: config.acknowledgement,
        response: {
          requestId: config.requestId,
        },
      };

      if (config.errCode) {
        body.error = {
          code: config.errCode,
          message: config.errMessage || "Error occured",
        };
      }

      const res = await new Request().request({
        headers,
        method: "POST",
        requestBody: body,
        url,
      });

      return body;
    } catch (error) {
      console.log(error);
    }
  };


  



}
