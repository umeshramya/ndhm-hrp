# ABDM Milestone 2 - Sandbox Documentation v2.8 (13.02.2026)

Source file: `M2_Document_16_02_2026_11822aedc7 (2).pdf`

---

## 1. Base URLs and X-CM-ID

| Environment | Base URL | X-CM-ID |
|-------------|----------|---------|
| Sandbox | `https://dev.abdm.gov.in` | `Sbx` |
| Production | `https://apis.abdm.gov.in` | `Abdm` |

## 2. Terminology

- **Bridge ID**: Client ID provided by NHA to HIP (alphanumeric, e.g., `SBX_00XXXX`)
- **Service ID**: Facility ID generated from NHPR application (alphanumeric, e.g., `IN02100000XX`)

---

## 3. Gateway APIs (v3)

### 3.2.1 Auth Token API
- `POST /api/hiecm/gateway/v3/sessions`
- Request body: `{ clientId, clientSecret, grantType: "client_credentials" }`
- Response: 202 Accepted with `{ accessToken, expiresIn, refreshToken, refreshExpiresIn, tokenType }`
- **Note**: Current SDK uses `v0.5/sessions` -- needs migration to `v3/sessions`

### 3.2.2 OpenID Configuration API
- `GET /api/hiecm/gateway/v3/.well-known/openid-configuration`
- Response: `{ jwks_uri }`

### 3.2.3 Keycloak Certificate API
- `GET /api/hiecm/gateway/v3/certs`
- Response: JSON with `keys` array (RSA public keys, JWK format)

### 3.2.4 Update Bridge URL API
- `PATCH /api/hiecm/gateway/v3/bridge/url`
- Headers: Authorization (JWT), REQUEST-ID, TIMESTAMP, X-CM-ID
- Body: `{ url: "https://..." }`
- Response: 202 Accepted

### 3.2.5 Registration of Facility & Software Linkage
- Website: `https://hspsbx.abdm.gov.in/home` (sandbox), `https://nhpr.abdm.gov.in/home` (production)
- API for linking multiple bridges: `https://apihspsbx.abdm.gov.in/v4/int/v1/bridges/MutipleHRPAddUpdateServices`
- Parameters: facilityId (IN-prefixed, 12 chars), facilityName, bridgeId, hipName (max 15 chars, no special chars), type (HIP/HIU), active (boolean)

### 3.2.6 Find Bridge by Service ID
- `GET /api/hiecm/gateway/v3/bridge-service/serviceId/{serviceId}`
- Response: `{ id, bridgeId, serviceId, name, isHip, isHiu, isPhr, endpoints, active, registerTime, ... }`

### 3.2.7 Find Services by Bridge ID
- `GET /api/hiecm/gateway/v3/bridge-services`
- Response: `{ bridge: { id, name, url, active, blocklisted }, services: [{ id, name, types, endpoints, active }] }`
- Endpoints include: `hipEndpoints`, `hiuEndpoints`, `healthLockerEndpoints` with `use` (registration/data-upload) and `address`

---

## 4. HIP Initiated Linking (v3)

### 4.3.1 Link Token Generation
- `POST /api/hiecm/v3/token/generate-token`
- Headers: Authorization, REQUEST-ID, TIMESTAMP, X-HIP-ID, X-CM-ID
- Body: `{ abhaNumber, abhaAddress, name, gender, yearOfBirth }`
- Response: 202 Accepted
- Validation errors documented for all fields
- Max 3 link token requests per user per 24 hours (ABDM-1027)

### 4.3.2 Callback - Link Token Generation
- `POST {callback_url}/api/v3/hip/token/on-generate-token`
- Body: `{ abhaAddress, linkToken (JWT), response: { requestId } }`
- Headers: X-LINK-TOKEN required for validation

### 4.3.3 Linking Care Context
- `POST /api/hiecm/hip/v3/link/carecontext`
- Headers: Authorization, REQUEST-ID, TIMESTAMP, X-HIP-ID, X-CM-ID, X-LINK-TOKEN
- Body: `{ abhaNumber, abhaAddress, patient: [{ referenceNumber, display, careContexts: [{ referenceNumber, display }], hiType, count }] }`
- 7 hiTypes: `PRESCRIPTION`, `DIAGNOSTICREPORT`, `OPCONSULTATION`, `DISCHARGESUMMARY`, `IMMUNIZATIONRECORD`, `HEALTHDOCUMENTRECORD`, `WELLNESSRECORD`

### 4.3.4 Callback - Linking Care Context
- `POST {callback_url}/api/v3/link/on_carecontext`
- Body: `{ abhaAddress, status, response: { requestId } }`
- Error: Already linked care context (ABDM-1056)

### 4.3.5 Get All Patient Links
- `GET /api/hiecm/hip/v3/link/patient/links`
- Headers: Authorization, REQUEST-ID, TIMESTAMP, X-AUTH-TOKEN, X-CM-ID
- Params: `limit`
- Response: `{ patient: { id, links: [{ hip: { id, name, type }, referenceNumber, display, hiType, careContexts, dateCreated }] } }`

### 4.3.6 Notify Care Context Update
- `POST /api/hiecm/hip/v3/link/context/notify`
- Body: `{ notification: { patient: { id }, careContext: { patientReference, careContextReference }, hiTypes, date, hip: { id } } }`

### 4.3.7 Callback - Notify Care Context Update
- `POST {callbackURL}/api/v3/links/context/on-notify`

### 4.3.8 SMS Notification to Patients
- `POST /api/hiecm/hip/v3/link/patient/links/sms/notify2`

### 4.3.9 Callback - SMS Notification
- `POST {callbackURL}/api/v3/patients/sms/on-notify`

---

## 5. User Initiated Linking (v3)

### 5.3.1 Patient Health Record Discovery
- `POST /api/hiecm/user-initiated-linking/v3/patient/care-context/discover`
- Body: `{ hipId, unverifiedIdentifiers: [{ type: "ABHA_ADDRESS", value }] }`

### 5.3.2 HIE-CM Callback to HIP - Discovery
- `POST {callback_url}/api/v3/hip/patient/care-context/discover`
- Body: `{ transactionId, patient: { id, verifiedIdentifiers, unverifiedIdentifiers, name, gender, yearOfBirth } }`

### 5.3.3 HMIS/LMIS Response on Discover
- `POST /api/hiecm/user-initiated-linking/v3/patient/care-context/on-discover`
- Body (success): `{ transactionId, patient: [{ referenceNumber, display, careContexts, hiType, count }], matchedBy, response: { requestId } }`
- Body (failure): `{ transactionId, error: { code, message }, response: { requestId } }`

### 5.3.4 HIE-CM Callback on Discover
- `POST {callback_url}/api/v3/hiu/patient/care-context/on-discover`

### 5.3.5 Patient Health Record Link Init
- `POST /api/hiecm/user-initiated-linking/v3/link/care-context/init`
- Body: `{ transactionId, abhaAddress, patient: [{ referenceNumber, careContexts, hiType, count }] }`

### 5.3.6 HIE-CM Callback - Link Init
- `POST {callback_url}/api/v3/hip/link/care-context/init`
- Body: `{ transactionId, abhaAddress, patient: [{ referenceNumber, careContexts, hiType, count }] }`

### 5.3.7 HMIS/LMIS Response on Link
- `POST /api/hiecm/user-initiated-linking/v3/link/care-context/on-init`
- Body: `{ transactionId, link: { referenceNumber, authenticationType, meta: { communicationMedium, communicationHint, communicationExpiry } }, response: { requestId } }`
- authenticationType: `MEDIATE` or `DIRECT`

### 5.3.8 HIE-CM Response on Link
- `POST {callback_url}/api/v3/hiu/patient/care-context/on-init`

### 5.3.9 Patient Health Record Confirm
- `POST /api/hiecm/user-initiated-linking/v3/link/care-context/confirm`
- Body: `{ token, linkRefNumber }`

### 5.3.10 HIE-CM Callback - Confirm
- `POST {callback_url}/api/v3/hip/link/care-context/confirm`
- Body: `{ confirmation: { token, linkRefNumber } }`

### 5.3.11 HMIS/LMIS Response on Confirm
- `POST /api/hiecm/user-initiated-linking/v3/link/care-context/on-confirm`
- Body: `{ patient: [{ referenceNumber, display, careContexts, hiType, count }], response: { requestId } }`

### 5.3.12 HIE-CM Response on Confirm
- `POST {callback_url}/api/v3/hiu/patient/care-context/on-confirm`

---

## 6. Data Flow (v3)

### 6.3.1 Consent Notify to HIP
- `POST {callbackURL}/api/v3/consent/request/hip/notify`
- Full consent artefact payload with: status, consentId, patient, purpose, permission (accessMode, dateRange, dataEraseAt, frequency), signature, grantAcknowledgement
- **Important**: This is a callback, not a direct API the SDK calls

### 6.3.2 HIP Respond to Consent Notify
- `POST /api/hiecm/consent/v3/request/hip/on-notify`
- Body: `{ acknowledgement: { status: "OK" | "ERROR", consentId }, error?: { code, message }, response: { requestId } }`

### 6.3.3 Health Information Request - Callback to HIP
- `POST {callback_URL}/api/v3/hip/health-information/request`
- Contains: consent ID, dateRange, **dataPushUrl** (HIU's URL for HIP to push data), **keyMaterial** (cryptoAlg, curve, dhPublicKey with expiry/parameters/keyValue, nonce)

### 6.3.4 HIP Acknowledgement
- `POST /api/hiecm/data-flow/v3/health-information/hip/on-request`
- Body: `{ hiRequest: { transactionId }, response: { requestId } }` or error response

### 6.3.5 HIP Calling Data Push URL
- `POST /api-hiu/data/notification` (to HIU's dataPushUrl, NOT to HIE-CM)
- Body: `{ pageNumber, pageCount, transactionId, entries: [{ content (encrypted FHIR), media, checksum, careContextReference }], keyMaterial }`

### 6.3.6 Health Information Notify
- `POST /api/hiecm/data-flow/v3/health-information/notify`
- HIP sends: sessionStatus = `TRANSFERRED` | `FAILED`, hiStatus = `DELIVERED` | `ERRORED`
- HIU sends: sessionStatus = `RECEIVED` | `FAILED`, hiStatus = `OK` | `ERRORED`

---

## 7. Scan and Profile Share (v3)

### 7.3.1 Profile Share
- `POST /api/hiecm/patient-share/v3/share`
- Headers: Authorization, REQUEST-ID, TIMESTAMP, X-HIU-ID, X-CM-ID, **X-AUTH-TOKEN** (from IDP)
- Body: `{ intent: "PROFILE_SHARE", metaData: { hipId, context, hprId, latitude, longitude }, profile: { patient: { abhaNumber, abhaAddress, name, gender, dayOfBirth, monthOfBirth, yearOfBirth, address, phoneNumber } } }`

### 7.3.2 Profile Share - Callback
- `POST {callback_url}/api/v3/hip/patient/share`

### 7.3.3 Profile On-Share
- `POST /api/hiecm/patient-share/v3/on-share`
- Body (success): `{ acknowledgement: { abhaAddress, status: "success", profile: { context, tokenNumber, expiry } }, response: { requestId } }`
- Body (error): `{ error: { code, message }, response: { requestId } }`

### 7.3.4 Profile On-Share - Callback
- `POST {callback_url}/api/v3/hiu/patient/on-share`

---

## 8. Full API Listing Summary

### HIP Initiated Linking
| # | API | Description |
|---|-----|-------------|
| 1.1 | `POST /api/hiecm/v3/token/generate-token` | Generate linking token |
| 1.2 | `POST {cb}/api/v3/hip/token/on-generate-token` | Callback for link token |
| 1.3 | `POST /api/hiecm/hip/v3/link/carecontext` | Link care context |
| 1.4 | `POST {cb}/api/v3/link/on_carecontext` | Callback for link |
| 1.5 | `GET /api/hiecm/hip/v3/link/patient/links` | Get all patient links |
| 1.6 | `POST /api/hiecm/hip/v3/link/context/notify` | Notify care context update |
| 1.7 | `POST {cb}/api/v3/links/context/on-notify` | Callback for notify |
| 1.8 | `POST /api/hiecm/hip/v3/link/patient/links/sms/notify2` | SMS notification |
| 1.9 | `POST {cb}/api/v3/patients/sms/on-notify` | Callback for SMS |
| 1.10 | `POST /api/hiecm/hip/v3/link/patient/links/hip/ondeactivate` | HIP on deactivate |
| 1.11 | `POST /api/hiecm/hip/v3/link/patient/links/hiu/ondeactivate` | HIU on deactivate |

### User Initiated Linking
| # | API | Description |
|---|-----|-------------|
| 2.1 | `POST /api/hiecm/user-initiated-linking/v3/patient/care-context/discover` | Patient discovers records |
| 2.2 | `POST {cb}/api/v3/hip/patient/care-context/discover` | CM callback to HIP |
| 2.3 | `POST /api/hiecm/user-initiated-linking/v3/patient/care-context/on-discover` | HIP response to discover |
| 2.4 | `POST {cb}/api/v3/hiu/patient/care-context/on-discover` | CM callback to HIU |
| 2.5 | `POST /api/hiecm/user-initiated-linking/v3/link/care-context/init` | Patient initiates link |
| 2.6 | `POST {cb}/api/v3/hip/link/care-context/init` | CM callback to HIP |
| 2.7 | `POST /api/hiecm/user-initiated-linking/v3/link/care-context/on-init` | HIP response to init |
| 2.8 | `POST {cb}/api/v3/hiu/patient/care-context/on-init` | CM callback to HIU |
| 2.9 | `POST /api/hiecm/user-initiated-linking/v3/link/care-context/confirm` | Patient confirms |
| 2.10 | `POST {cb}/api/v3/hip/link/care-context/confirm` | CM callback to HIP |
| 2.11 | `POST /api/hiecm/user-initiated-linking/v3/link/care-context/on-confirm` | HIP response to confirm |
| 2.12 | `POST {cb}/api/v3/hiu/patient/care-context/on-confirm` | CM callback to HIU |

### Patient Share / Profile
| # | API | Description |
|---|-----|-------------|
| 3.1 | `POST /api/hiecm/patient-share/v3/share` | Profile share |
| 3.2 | `POST {cb}/api/v3/hip/patient/share` | Callback for share |
| 3.3 | `POST /api/hiecm/patient-share/v3/on-share` | HIP acknowledges share |
| 3.4 | `POST {cb}/api/v3/hiu/patient/on-share` | Callback for on-share |

### Session / Gateway
| # | API | Description |
|---|-----|-------------|
| 4.1 | `POST /api/hiecm/gateway/v3/sessions` | Auth token |
| 5.1 | `PATCH /api/hiecm/gateway/v3/bridge/url` | Update bridge URL |
| 5.2 | `GET /api/hiecm/gateway/v3/certs` | Keycloak certificates |
| 5.3 | `GET /api/hiecm/gateway/v3/.well-known/openid-configuration` | OpenID config |
| 5.4 | `GET /api/hiecm/gateway/v3/bridge-service/serviceId/{serviceId}` | Find bridge by service |
| 5.5 | `GET /api/hiecm/gateway/v3/bridge-services` | Find services by bridge |

### Data Flow
| # | API | Description |
|---|-----|-------------|
| 6.1 | `POST /api/hiecm/consent/v3/request/hip/on-notify` | Consent acknowledge |
| 6.2 | `POST /api/hiecm/data-flow/v3/health-information/hip/on-request` | HI request acknowledge |
| 6.3 | `POST /api-hiu/data/notification` | Push data to HIU |
| 6.4 | `POST /api/hiecm/data-flow/v3/health-information/notify` | Notify data transfer status |

---

## 9. Error Codes

### Common Errors
| Code | Message |
|------|---------|
| ABDM-1000 | Unable to connect the database |
| ABDM-1001 | No data found |
| ABDM-1006 | Bad Request, invalid request Body |
| ABDM-1010 | Validation failed |
| ABDM-1015 | Invalid Response |
| ABDM-1016 | Invalid TimeStamp |
| ABDM-1017 | Invalid TransactionId |
| ABDM-1019 / ABDM-1024 | Dependent Service Unavailable |
| ABDM-1022 | Too many requests |
| ABDM-1026 | Invalid Link Token |
| ABDM-1027 | You are blocked. Please try again after 24 hours |
| ABDM-1030 | Invalid request ID |
| ABDM-1031 | Invalid request |
| ABDM-1035 | Invalid HIP ID |
| ABDM-1037 | Counter and Care context count mismatch |
| ABDM-1038 | ABHA address and Link token mismatch |
| ABDM-1040 | Invalid HIU ID |
| ABDM-1051 | Invalid ABHA Number or ABHA Address |
| ABDM-1056 | This care context has been already linked |
| ABDM-1059 | Invalid Care Contexts count |
| ABDM-1062 | ABHA number mismatch with Link token |
| ABDM-1063 | HIP Id mismatch with Link token |
| ABDM-1064 | Request body was missing |
| ABDM-1065 | Invalid X Auth token |
| ABDM-1066 | Invalid JWT token |
| ABDM-1090 | Duplicate HIP link request |
| ABDM-1092 | Duplicate Link token request |
| ABDM-1103 | Duplicate Discovery request |
| ABDM-1115 | Invalid patient information. At least one patient information is required |
| ABDM-1125 | ABHA number and ABHA address cannot be null |
| ABDM-1207 | Demographic details was invalid or doesn't exists |
| ABDM-9999 | Unknown exception |

---

## Key Observations for SDK Changes

1. **API Version Migration**: The document confirms all APIs are now **v3**. The current SDK uses a mix of v0.5, v1.0, and v3. All gateway endpoints need migration from `v0.5` to `v3`.

2. **Sessions API Changed**: Auth token is now at `/api/hiecm/gateway/v3/sessions` instead of `v0.5/sessions`. The response structure includes `refreshToken` and `refreshExpiresIn` in addition to `accessToken`.

3. **New Gateway APIs**: Bridge management APIs (bridge URL update, bridge lookup by service, services by bridge) are new v3 additions not yet in the SDK.

4. **Consent Flow**: Consent endpoints changed from `v0.5/consents` to `v3/consent/request/hip/on-notify` etc.

5. **Data Flow**: Changed from `v0.5` to `v3/data-flow` prefix.

6. **User Initiated Linking**: Entirely new v3 endpoints under `/api/hiecm/user-initiated-linking/v3/`.

7. **Profile Share**: New v3 endpoints under `/api/hiecm/patient-share/v3/`.

8. **Callback URL Convention**: All callbacks follow the pattern `{callback_url}/api/v3/{path}` - these are endpoints the SDK user must implement on their server.

9. **Common Headers**: Every API requires `REQUEST-ID` (UUID), `TIMESTAMP` (ISO 8601), `X-CM-ID`, and `Authorization` (JWT Bearer token).

10. **X-AUTH-TOKEN**: Used for PHR app-facing APIs (patient links, discover, confirm, profile share) - this is the user's JWT from the IDP, not the session token.
