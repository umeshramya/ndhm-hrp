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
  | "WellnessRecord";

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
    const url = `${this.baseUrl}gateway/v0.5/links/link/add-contexts`;
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
    const url = `${this.baseUrl}gateway/v0.5/links/context/notify`;
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
