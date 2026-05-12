import Header from "./header";
import { v4 as uuidv4 } from "uuid";
import Request from "./request";

export interface STATUS_RESPONSES_HEALTH_INFORMATION_NOTIFY {
  careContextReference: string;
  hiStatus: "DELIVERED" | "OK" | "ERRORED";
  description: string;
}

export default class HealthInformation extends Header {
  constructor(_baseUrl: string, _accessToken: string) {
    super(_baseUrl, _accessToken);
  }

  /**
   * V3: HIP notifies CM of data transfer status after pushing encrypted data to HIU.
   * HIU notifies CM after receiving data.
   *
   * Endpoint: POST /api/hiecm/data-flow/v3/health-information/notify
   * Per ABDM M2 Sandbox Documentation v2.8, Section 6.3.6
   *
   * HIP sends: sessionStatus = TRANSFERRED | FAILED, hiStatus = DELIVERED | ERRORED
   * HIU sends: sessionStatus = RECEIVED | FAILED, hiStatus = OK | ERRORED
   *
   * @param config.healthId - ABHA address used to derive X-CM-ID
   * @param config.consentId - Consent ID
   * @param config.transactionId - Transaction ID from the HI request callback
   * @param config.notifer - "HIP" or "HIU"
   * @param config.notifierId - ID of notifier
   * @param config.hipId - HIP facility ID
   * @param config.sessionStatus - "TRANSFERRED" | "FAILED" for HIP, "RECEIVED" | "FAILED" for HIU
   * @param config.statusResponses - Array of per-care-context statuses
   * @param config.requestId - Optional UUID for REQUEST-ID header
   * @param config.timestamp - Optional ISO timestamp for TIMESTAMP header
   * @param config.error - Optional error object { code, message }
   * @returns The request body that was sent
   */
  notify = async (config: {
    healthId: string;
    consentId: string;
    transactionId: string;
    notifer: "HIU" | "HIP";
    notifierId: string;
    hipId: string;
    sessionStatus: "TRANSFERRED" | "FAILED";
    statusResponses: STATUS_RESPONSES_HEALTH_INFORMATION_NOTIFY[];
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
      const url = `${this.baseUrl}/api/hiecm/data-flow/v3/health-information/notify`;

      const body: any = {
        notification: {
          consentId: config.consentId,
          transactionId: config.transactionId,
          doneAt: new Date().toISOString(),
          notifier: {
            type: config.notifer,
            id: config.notifierId,
          },
          statusNotification: {
            sessionStatus: config.sessionStatus,
            hipId: config.hipId,
            statusResponses: config.statusResponses,
          },
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

      return body;
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * V3: HIU requests health information from HIP via CM.
   * Called after HIU receives GRANTED consent notification.
   *
   * Endpoint: POST /api/hiecm/data-flow/v3/health-information/request
   */
  cmRequest = async (config: {
    healthId: string;
    consentId: string;
    dateRange: {
      from: string;
      to: string;
    };
    publicKey: string;
    expireDate: string;
    nounce: string;
    dataPushUrl: string;
    hiuId?: string;
    errCode?: any;
    errMessage?: any;
  }) => {
    try {
      this.setXCmId(config.healthId);
      const headers: any = {
        "REQUEST-ID": uuidv4(),
        TIMESTAMP: new Date().toISOString(),
        "X-CM-ID": this.xCmId,
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      };
      if (config.hiuId) {
        headers["X-HIU-ID"] = config.hiuId;
      }
      const url = `${this.baseUrl}/api/hiecm/data-flow/v3/health-information/request`;

      const body: HIU_CM_REQUEST = {
        hiRequest: {
          consent: {
            id: config.consentId,
          },
          dateRange: config.dateRange,
          dataPushUrl: config.dataPushUrl,
          keyMaterial: {
            cryptoAlg: "ECDH",
            curve: "Curve25519",
            dhPublicKey: {
              expiry: config.expireDate,
              parameters: "Curve25519/32byte random key",
              keyValue: config.publicKey,
            },
            nonce: config.nounce,
          },
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

      console.log("cmRequest V3 ABDM response:", res.status, res.statusText, res.body?.slice(0, 500));

      // Merge CM response fields into the returned body
      if (res.body) {
        try {
          const resBody = JSON.parse(res.body);
          if (resBody.transactionId) {
            body.hiRequest.transactionId = resBody.transactionId;
          }
          if (resBody.requestId) {
            (body as any).requestId = resBody.requestId;
          }
        } catch {}
      }

      return body;
    } catch (error) {
      console.log(error);
    }
  };
}


/**
 * V3 HIU_CM_REQUEST — requestId/timestamp moved to V3 inline headers.
 * privateKey, transactionId, xhiuid, healthId, status are local-only fields
 * set by the caller after cmRequest() returns.
 */
export interface HIU_CM_REQUEST {
  hiRequest: {
    consent: {
      id: string
    }
    dateRange: {
      to: string
      from: string
    }
    dataPushUrl: string
    keyMaterial: {
      curve: string
      nonce: string
      cryptoAlg: string
      dhPublicKey: {
        expiry: string
        keyValue: string
        parameters: string
      }
    }
    privateKey?: string
    transactionId?: string
    xhiuid?: string;
    healthId?: string;
    status?: string
  }
  error?: {
    code: any,
    message: any
  }
}

