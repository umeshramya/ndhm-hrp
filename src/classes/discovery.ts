import Header from "./header";
import { v4 as uuidv4 } from "uuid";
import Request from "./request";

type HI_TYPES =
  | "OPConsultation"
  | "DiagnosticReport"
  | "Prescription"
  | "ImmunizationRecord"
  | "DischargeSummary"
  | "HealthDocumentRecord"
  | "WellnessRecord"
  | "InitialAssessment"
  | "DietaryRecord";

export default class Discovery extends Header {
  constructor(_baseUrl: string, _accessToken: string) {
    super(_baseUrl, _accessToken);
  }

  /**
   * HMIS/LMIS response to the HIE-CM discovery callback (User Initiated Linking v3).
   *
   * Called by the HIP after receiving the discovery callback at
   * `{callback_url}/api/v3/hip/patient/care-context/discover` (section 5.3.2).
   * The HIP searches its records and returns matching patients with their
   * associated care contexts, HI type, and count. If no match is found, an
   * error is returned instead.
   *
   * Uses the v3 endpoint per ABDM M2 Sandbox Documentation v2.8 (section 5.3.3):
   * `POST /api/hiecm/user-initiated-linking/v3/patient/care-context/on-discover`
   *
   * @param config - Configuration object
   * @param config.healthId - Patient's ABHA address (e.g. "user@sbx") used to derive X-CM-ID
   * @param config.transactionId - Transaction ID from the HIE-CM discovery callback, used for correlation
   * @param config.patients - Array of matched patient entries, each with:
   *   - referenceNumber - Patient reference in HIP system
   *   - display - Display name for the patient
   *   - careContexts - Array of { referenceNumber, display }
   *   - hiType - Type of health information (HI_TYPES)
   *   - count - Number of care contexts
   * @param config.matchedBy - Array of matching criteria used (e.g. ["MR", "NAME", "DOB"])
   * @param config.callbackRequestId - The `requestId` from the HIE-CM discovery callback, sent in `response.requestId`
   * @param config.error - Optional error object if no matching patient was found (code, message)
   * @param config.requestId - Optional UUID for REQUEST-ID header (auto-generated if omitted)
   * @param config.timestamp - Optional ISO timestamp for TIMESTAMP header (auto-generated if omitted)
   * @returns The request body that was sent (for logging/reference)
   */
  onDiscovery = async (config: {
    healthId: string;
    transactionId: string;
    patients?: Array<{
      referenceNumber: string;
      display: string;
      careContexts: Array<{
        referenceNumber: string;
        display: string;
      }>;
      hiType: HI_TYPES;
      count: number;
    }>;
    matchedBy?: string[];
    callbackRequestId: string;
    error?: {
      code: string;
      message: string;
    };
    requestId?: string;
    timestamp?: string;
  }) => {
    this.setXCmId(config.healthId);
    const headers = {
      "REQUEST-ID": config.requestId ?? uuidv4(),
      TIMESTAMP: config.timestamp ?? new Date().toISOString(),
      "X-CM-ID": this.xCmId,
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.accessToken}`,
    };
    const url = `${this.baseUrl}/api/hiecm/user-initiated-linking/v3/patient/care-context/on-discover`;

    const body: any = {
      transactionId: config.transactionId,
      response: {
        requestId: config.callbackRequestId,
      },
    };

    if (config.error) {
      body.error = config.error;
    } else {
      body.patient = config.patients;
      body.matchedBy = config.matchedBy;
    }

    await new Request().request({
      headers,
      method: "POST",
      requestBody: body,
      url,
    });

    return body;
  };
}
