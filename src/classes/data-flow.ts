import Header from "./header";
import { v4 as uuidv4 } from "uuid";
import Request from "./request";


export default class DataFlow extends Header {
  constructor(_baseUrl: string, _accessToken: string) {
    super(_baseUrl, _accessToken);
  }
  /**
   * V3: API called by HIP to acknowledge Health Information request receipt.
   * Called in response to CM callback POST {cb}/api/v3/hip/health-information/request.
   *
   * Endpoint: POST /api/hiecm/data-flow/v3/health-information/hip/on-request
   * Per ABDM M2 Sandbox Documentation v2.8, Section 6.3.4
   *
   * @param config.healthId - ABHA address used to derive X-CM-ID
   * @param config.transactionId - Transaction ID from the HI request callback
   * @param config.callbackRequestId - The requestId from the HIE-CM callback, echoed in response.requestId
   * @param config.requestId - Optional UUID for REQUEST-ID header
   * @param config.timestamp - Optional ISO timestamp for TIMESTAMP header
   * @param config.error - Optional error object { code, message }
   * @returns The request body that was sent
   */
  onhipRequest = async (config: {
    healthId: string;
    transactionId: string;
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
      const url = `${this.baseUrl}/api/hiecm/data-flow/v3/health-information/hip/on-request`;

      const body: any = {
        hiRequest: {
          transactionId: config.transactionId,
          sessionStatus: "ACKNOWLEDGED",
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

      return body;
    } catch (error) {
      console.log(error);
    }
  };

  // dataPushURL = async (config: {
  //   healthId: string;
  //   datapushUrl: string;
  //   linkEntries?: {
  //     link: string;
  //     media: "application/fhir+json";
  //     checksum: "string";
  //     careContextReference: string;
  //   }[];
  //   dataEntries?: {
  //     content: string;
  //     media: "application/fhir+json";
  //     checksum: "string";
  //     careContextReference: string;
  //   }[];
  //   pageCount: number;
  //   pageIndex: number;
  //   transactionId: string;
  //   expireDate: string;
  //   publicKey: string;
  //   nonce: string;
  //   errCode: string;
  //   errMessage: string;
  // }) => {
  //   try {
  //     const headers = this.headers(config.healthId);
  //     const url = config.datapushUrl;
  //     const webhookUrl =`https://webhook.site/eacde937-5faf-4f30-b5d5-348d7b99f1f3/hip/datapush`

  //     const entries: any[] = [];
  //     if (config.dataEntries) {
  //       config.dataEntries.forEach((element) => {
  //         entries.push(element);
  //       });
  //     }
  //     if (config.linkEntries) {
  //       config.linkEntries.forEach((el) => {
  //         entries.push(el);
  //       });
  //     }

  //     const body: any = {
  //       pageNumber: config.pageIndex,
  //       pageCount: config.pageCount,
  //       transactionId: config.transactionId,
  //       entries: entries,
  //       keyMaterial: {
  //         cryptoAlg: "ECDH",
  //         curve: "Curve25519",
  //         dhPublicKey: {
  //           expiry: config.expireDate,
  //           parameters: "Curve25519/32byte random key",
  //           keyValue: config.publicKey,
  //         },
  //         nonce: config.nonce,
  //       },
  //     };

  //     if (config.errCode) {
  //       body.error = {
  //         code: config.errCode,
  //         message: config.errMessage || "Error occured",
  //       };
  //     }

  //     const res = await new Request().request({
  //       headers: headers,
  //       method: "POST",
  //       requestBody: body,
  //       url: url,
  //     }).then(res=>console.log(res)).catch(err=>console.log(err))



      

  //     const resWebhook = await new Request().request({
  //       headers: headers,
  //       method: "POST",
  //       requestBody: body,
  //       url: webhookUrl,
  //     });

  //     return body;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

}
