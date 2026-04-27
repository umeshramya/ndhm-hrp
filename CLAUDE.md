# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Test Commands

- **Build**: `npm run build` (or `npm run dev`) -- runs `tsc` to compile `src/` to `lib/`
- **Run ad-hoc tests**: `node test/accessToken.js`, `node test/encrypt.js`, `cd test/nhcx && node participate.js`
- **Tests are plain Node.js scripts** (no Jest/Mocha) in `test/` directory. They require environment variables (`NDHM_CLIENT_ID`, `NDHM_CLIENT_SECRET`, `NDHM_URL`, etc.) loaded via `dotenv`.
- **No linter or formatter** configured (ESLint, Prettier, etc.)

## Project Overview

`ndhm-hrp` is a TypeScript SDK for India's ABDM (Ayushman Bharat Digital Mission) / NDHM gateway APIs. It wraps gateway REST endpoints for Health Information Providers (HIPs), Health Information Users (HIUs), and HCX (Health Claims Exchange). Published as an npm package; compiled output in `lib/` is what gets published.

## Architecture

### Class-per-API-Domain Pattern

Each ABDM gateway API domain has its own class in `src/classes/`. All classes (except `Register`, `AbhaNumber`, `Request`, and HCX classes) extend `Header`:

```
Header (base class) -- src/classes/header.ts
  Stores baseUrl, accessToken, xCmId
  headers(healthId) builds auth header with Bearer token + X-CM-ID
  setXCmId(healthId) extracts CM suffix from health ID (e.g., "xyz@sbx" -> "sbx")

  Subclasses: UserAuth, Link, Discovery, ConsentFlow, ConsentRequest,
              DataFlow, HealthInformation, Patients, Profile,
              SubscriptionRequest, Subscriptions

Standalone classes (no base class):
  Register        -- Session/authentication (v0.5/sessions, devservice, bridge registration)
  AbhaNumber      -- ABHA (Health ID) creation via Aadhaar flow (v1/registration/aadhaar)
  Request         -- Thin wrapper around the deprecated `request` npm library
  JWEHelper       -- JWE encrypt/decrypt static methods using node-jose (src/classes/nhcx/JWEHelper.ts)
  Participant     -- HCX participant CRUD using axios (src/classes/nhcx/Particpant.ts)
```

### Entry Point

`src/index.ts` re-exports all classes and selected constants/enums. HCX classes (`JWEHelper`, `Participant`) and interfaces (`HcxProtectedHeaders`, `NhcxApiResponse`) are exported separately.

### API Version Mix

The codebase uses multiple ABDM API versions:
- **v0.5** -- most gateway endpoints (auth, links, consents, discovery, patients, subscriptions)
- **v1.0** -- profile sharing (`patients/profile/on-share`)
- **v3** -- token generation (`api/hiecm/v3/token/generate-token` in link.ts)
- **v1** -- ABHA registration (`/v1/registration/aadhaar/*`)

### Two HTTP Libraries

- **`request`** (deprecated, `npmjs.com/package/request`) used by the `Request` wrapper and most ABDM classes
- **`axios`** used directly in `Particpant.ts`, `backup.ts`, and test scripts

### Key Dependencies

- `request` (deprecated) + `@types/request`
- `axios` for HCX module
- `node-jose` + `jose` for JWE/JWS
- `node-rsa` for RSA key operations
- `uuid` for request ID generation
- `moment` for date formatting

## Notable Gotchas

1. **Typo in filename and export**: `Particpant.ts` (missing "i") -- exported as `Participant` at the index level but the file/class itself is misspelled.
2. **`request` library is deprecated** and unmaintained since Feb 2020. There's an incomplete migration to `axios` underway.
3. **`v0.5/sessions` URL is hardcoded** in `register.ts` with a fallback to `https://dev.abdm.gov.in/`; the README notes it should come from an environment variable.
4. **No test framework** -- tests are ad-hoc scripts with no assertions, no CI.
5. **Common spelling issues** throughout the codebase: `clinetSecrete`, `patinetDisplay`, `nounce`, `heeder`, `partipitantType`, `PolicesList`.
6. **`lib/` is in .gitignore** -- compiled output is not committed. Always rebuild with `npm run build` after changes.
7. **TypeScript strict mode** is enabled -- the compiler will catch many issues during `tsc`.
