export const HcxStatus = [
    "request.initiated",
    "request.queued",
    "response.complete",
    "response.partial",
    "response.error"
  ] as const
  
  
 export  interface  HcxProtectedHeaders {
    "x-hcx-api_call_id": string;
    "x-hcx-workflow_id": string;
    "x-hcx-request_id": string;
    "x-hcx-status": typeof HcxStatus[number];
    "x-hcx-timestamp": string;
    "x-hcx-sender_code": string;
    "x-hcx-recipient_code": string;
    "x-hcx-correlation_id": string;
    "x-hcx-ben-abha-id" : string
    "x-hcx-use_case" ? : "New" | "Enhancement",
    "x-user-token"?:string
  }


  interface Error {
    code: string;
    message: string;
  }
  
  interface StatusResponseObject {
    sender_code: string;
    recipient_code: string;
    entity_type: 'coverageeligibility' | 'predetermination' | 'preauth' | 'claim' | 'task' | 'payment' | 'insuranceplan' | 'communication';
    protocol_status: 'request.queued' | 'request.error' | 'request.dispatched';
  }
  
  export interface NhcxApiResponse {
    timestamp: string;
    api_call_id: string; // UUID format
    correlation_id: string; // UUID format
    result: StatusResponseObject;
    error?: Error; // Optional
  }
  


