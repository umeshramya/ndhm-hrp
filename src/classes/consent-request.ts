import Header from "./header";
import { v4 as uuidv4 } from "uuid";
import Request from "./request";
export const PurposeArray = [
  { code: "CAREMGT", display: "Care Management" },
  { code: "BTG", display: "Break the Glass" },
  { code: "PUBHLTH", display: "Public Health" },
  { code: "HPAYMT", display: "Healthcare Payment" },
  { code: "DSRCH", display: "Disease Specific Healthcare Research" },
  { code: "PATRQT", display: "Self Requested" },
] as const;

export interface CONSENTFLOW_REQUEST_INIT {
  healthId: string;
  errCode?: string;
  errMessage?: string;
  purpose: typeof PurposeArray[number] & { refUri?: string };
  hipId?: string;
  careContexts?: {
    patientReference: string;
    careContextReference: string;
  }[];
  hiTypes: hiTypes[];
  dateRange: { from: string; to: string };
  dataEraseAt: string;
  frequency: {
    unit: "HOUR";
    value: number;
    repeats: number;
  };
  accessMode: "VIEW" | "STORE" | "QUERY" | "STREAM";
  hiu: string;
  requester: {
    name: string;
    identifier?: {
      type: string;
      value: string;
      system?: string;
    };
  };
}
const puposeDisplay = PurposeArray.map((el) => el);
type pouposeType = typeof puposeDisplay[number];
type categories ="LINK" | "DATA"




const hiTypesArry = [
  "OPConsultation",
  "Prescription",
  "DischargeSummary",
  "DiagnosticReport",
  "ImmunizationRecord",
  "HealthDocumentRecord",
  "WellnessRecord",
] as const;
const hiTypesIntern = hiTypesArry.map((el) => el);
type hiTypes = typeof hiTypesIntern[number];

const typePurpose = typeof PurposeArray.map((el) => el);
export default class ConsentRequest extends Header {
  constructor(_baseUrl: string, _accessToken: string) {
    super(_baseUrl, _accessToken);
  }
  /**
   * Creates a consent request to get data about a patient by HIU user (V3).
   * Endpoint: POST /api/hiecm/consent/v3/request/init
   * @param config
   * @returns { requestId } - the REQUEST-ID header value for callback lookup
   */
  init = async (config: CONSENTFLOW_REQUEST_INIT) => {
    try {
      this.setXCmId(config.healthId);
      const requestId = uuidv4();
      const headers = {
        "REQUEST-ID": requestId,
        TIMESTAMP: new Date().toISOString(),
        "X-CM-ID": this.xCmId,
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      };
      const url = `${this.baseUrl}/api/hiecm/consent/v3/request/init`;

      const body: any = {
        consent: {
          patient: {
            id: config.healthId,
          },
          purpose: {
            text: config.purpose.display,
            code: config.purpose.code,
            refUri: config.purpose.refUri || "http://terminology.hl7.org/ValueSet/v3-PurposeOfUse",
          },
          hiu: {
            id: config.hiu,
          },
          requester: config.requester,
          hiTypes: config.hiTypes,
          permission: {
            accessMode: config.accessMode,
            dateRange: config.dateRange,
            dataEraseAt: config.dataEraseAt,
            frequency: config.frequency,
          },
        },
      };

      if (config.hipId) {
        body.consent.hip = {
          id: config.hipId,
        };
      }

      if (config.careContexts) {
        const careContexts: {
          patientReference: string;
          careContextReference: string;
        }[] = [];
        config.careContexts.forEach((el) => {
          careContexts.push(el);
        });
        body.consent.careContexts = careContexts;
      }
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

      console.log("V3 CONSENT REQUEST INIT RESPONSE:", {
        status: res.status,
        statusText: res.statusText,
        body: res.body?.slice(0, 1000),
        requestId,
        url,
        requestBody: JSON.stringify(body).slice(0, 500),
      });

      return { requestId };
    } catch (error) {
      console.error("ConsentRequest.init() failed:", error);
      throw error;
    }
  };
/**
 * creates a request for subscription. The subscription categories can be for care-contexts linkages or availability of data against existing care-contexts. Note that the requester must have HIU role
 * @param config
 * @returns
 */



  status = async (config: { healthId: string; consentRequestId: string }) => {
    try {
      const headers = this.headers(config.healthId);
      const url = `${this.baseUrl}v0.5/consent-requests/status`;

      const body: any = {
        requestId: uuidv4(),
        timestamp: new Date().toISOString(),
        consentRequestId: config.consentRequestId,
      };

      const res = await new Request().request({
        headers: headers,
        method: "POST",
        requestBody: body,
        url: url,
      });

      return body;
    } catch (error) {
      console.error("ConsentRequest.status() failed:", error);
      throw error;
    }
  };
}
