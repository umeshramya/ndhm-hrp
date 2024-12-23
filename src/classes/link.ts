import { v4 as uuidv4 } from "uuid";
import Request from "./request";
import Header from "./header";

type HI_TYPES =
  | "OPConsultation"
  | "DiagnosticReport"
  | "Prescription"
  | "ImmunizationRecord"
  | "DischargeSummary"
  | "HealthDocumentRecord"
  | "WellnessRecord"
  | "InitialAssessment" // not part abdm
  

export default class Link extends Header {
  constructor(_baseUrl: string, _accessToken: string) {
    super(_baseUrl, _accessToken);
  }

  /**
   *
   * @param config healthis with Xcmid
   * @returns
   */
  AddContext = async (config: {
    healthId: string;
    careContextAccessToken: string;
    patientId: string;
    patinetDisplay: string;
    careContextId: string;
    careContextDisplay: string;
  }) => {
    const headers = this.headers(config.healthId);
    const url = `${this.baseUrl}v0.5/links/link/add-contexts`;
    const body = {
      requestId: uuidv4(),
      timestamp: new Date().toISOString(),
      link: {
        accessToken: config.careContextAccessToken,
        patient: {
          referenceNumber: config.patientId,
          display: config.patinetDisplay,
          careContexts: [
            {
              referenceNumber: config.careContextId,
              display: config.careContextDisplay,
            },
          ],
        },
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

  /**
   * Result of patient care-context link request from HIP end. This happens in context of previous discovery of patient found at HIP end, therefore the link requests ought to be in reference to the patient reference and care-context references previously returned by the HIP. The correlation of discovery and link request is maintained through the transactionId. HIP should have
   * @param config
   * 
   * Validated transactionId in the request to check whether there was a discovery done previously, and the link request corresponds to returned patient care care context references
Before returning the response, HIP should have sent an authentication request to the patient(eg: OTP verification)
HIP should communicate the mode of authentication of a successful request
HIP subsequently should expect the token passed via /link/confirm against the link.referenceNumber passed in this call
The error section in the body, represents the potential errors that may have occurred. Possible reasons:

Patient reference number is invalid
Care context reference numbers are invalid
   */
  onInit = async (config: {
    healthId: string;
    transactionId: string;
    referenceNumber: string;
    communicationHint: string;
    communicationExpiry?: string;
    requestId: string;
    error?: {
      code: number;
      message: string;
    };
  }) => {
    const headers = this.headers(config.healthId);
    const url = `${this.baseUrl}v0.5/links/link/on-init`;
    const body: any = {
      requestId: uuidv4(),
      timestamp: new Date().toISOString(),
      transactionId: config.transactionId,
      link: {
        referenceNumber: config.referenceNumber,
        authenticationType: "DIRECT",
        meta: {
          communicationMedium: "MOBILE",
          communicationHint: config.communicationHint,
          communicationExpiry:
            config.communicationExpiry ||
            new Date(new Date().getTime() + 10 * 60000).toISOString(),
        },
      },
      resp: {
        requestId: config.requestId,
      },
    };

    if (config.error) {
      body.error = config.error;
    }

    await new Request().request({
      headers: headers,
      method: "POST",
      requestBody: body,
      url: url,
    });

    return body;
  };

  /***
   * Returns a list of linked care contexts with patient reference number.
  Validated and linked account reference number
  Validated that the token sent from Consent Manager is same as the one generated by HIP
  Verified that same Consent Manager which made the link request is sending the token
  Results of unmasked linked care contexts with patient reference number
   */
  onConfirm = async (config: {
    healthId: string;
    careContextAccessToken: string;
    requestId: string;
    patientReferenceNumber: string;
    patinetDisplay: string;
    careContexts: {
      referenceNumber: string;
      display: string;
    }[];
    error?: {
      code: number;
      message: string;
    };
  }) => {
    const headers = this.headers(config.healthId);
    const url = `${this.baseUrl}v0.5/links/link/on-confirm`;
    
    const body: any = {
      requestId: uuidv4(),
      timestamp: new Date().toISOString(),
      patient: {
        referenceNumber: config.patientReferenceNumber,
        display: config.patinetDisplay,
        careContexts: config.careContexts,
      },

      resp: {
        requestId: config.requestId,
      },
    };

    if (config.error) {
      body.error = config.error;
    }

    await new Request().request({
      headers: headers,
      method: "POST",
      requestBody: body,
      url: url,
    });


    return body;
  };

  /**
   *This API is called by HIP only when there is new health data is added/created for a patient and under a care context that is already linked with patient's Health Account. HIP can send following things in this API to notify the Consent Manager about the new health data added:
   * @param config
   * @healthId Patient's Identifier for which the new health data is added (It can be ABDM address or phr address)
   * @careContextReference   Care Context reference under which the new health data is added
   * @patientReference  Patient's reference (An identifier with which the patient is registered on HIP)
   * @hiTypes  Types of health information documents that have been added ("DiagnosticReportRecord" | "DischargeSummaryRecord" | "HealthDocumentRecord" | "ImmunizationRecord" | "OPConsultRecord" | "PrescriptionRecord" | "WellnessRecord")
   * @date in iso format at UTC A date when the health information was created/added on the HIP Note: This API shouldn't be called if the new heath data of is added/created under new care context.
   */

  notify = async (config: {
    healthId: string;
    patientReference: any;
    careContextReference: any;
    hiTypes: HI_TYPES[];
    date: string;
    hipId: string;
  }) => {
    const headers = this.headers(config.healthId);
    const url = `${this.baseUrl}v0.5/links/context/notify`;

    const body = {
      requestId: uuidv4(),
      timestamp: new Date().toISOString(),
      notification: {
        patient: {
          id: config.healthId,
        },
        careContext: {
          patientReference: config.patientReference,
          careContextReference: config.careContextReference,
        },
        hiTypes: config.hiTypes,
        date: config.date,
        hip: {
          id: config.hipId,
        },
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
