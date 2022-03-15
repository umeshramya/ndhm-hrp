import Header from "./header";
import { v4 as uuidv4 } from "uuid";
import Request from "./request";

export default class ConsentFlow extends Header {
  constructor(_baseUrl: string, _accessToken: string) {
    super(_baseUrl, _accessToken);
  }
  /**
   * This API is called by HIP as acknowledgement to notification of consents, in cases of consent revocation and expiration.
   * @param  config.healthId: string; phradddress or ABHA addrress of patient
   * @param config.consentId: string; consent id recive by notify callback
   * @param  config.requestId: string; request id as recived by notify callback
   * @returns
   */
  onhipNotify = async (config: {
    healthId: string;
    consentId: string;
    requestId: string;
  }) => {
    const headers = this.headers(config.healthId);
    const url = `${this.baseUrl}gateway/v0.5/consents/hip/on-notify`;

    const body = {
      requestId: uuidv4(),
      timestamp: new Date().toISOString(),
      acknowledgement: {
        status: "OK",
        consentId: config.consentId,
      },
      error: {
        code: null,
        message: "",
      },
      resp: {
        requestId: config.requestId,
      },
    };

    await new Request().request({
      headers: headers,
      method: "POST",
      requestBody: body,
      url: url,
    });

    return body;
  };
}