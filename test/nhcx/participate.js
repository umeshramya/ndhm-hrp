const ndm = require("../../lib");
const dotenv = require("dotenv");

dotenv.config();

const { getToken } = require("../accessToken");

const participate = async () => {
  const accessToken = await getToken();
  const ret = new ndm.Participant({
    _accessToken: accessToken,
    endpointUrl: process.env.NHCX_ENDPOINT_URL,
    url: process.env.NHCX_PARTICIPANT_HCX_SERVICE_URL,
  });
  return ret;
};

const public_certicate=`-----BEGIN CERTIFICATE-----
MIID6TCCAtGgAwIBAgIUMawLmBSaIVT9+HDy38mYCA5BPx4wDQYJKoZIhvcNAQEL
BQAwgZwxCzAJBgNVBAYTAklOMRIwEAYDVQQIDAlLYXJuYXRha2ExETAPBgNVBAcM
CEh1YmJhbGxpMRAwDgYDVQQKDAdOaWNlSE1TMRAwDgYDVQQLDAdOaWNlSE1TMSAw
HgYDVQQDDBdodHRwc0wvL3d3dy5uaWNlaG1zLmNvbTEgMB4GCSqGSIb3DQEJARYR
YWRtaW5AbmljZWhtcy5jb20wHhcNMjQxMjIyMDkyMjMxWhcNMjUxMjIyMDkyMjMx
WjCBnDELMAkGA1UEBhMCSU4xEjAQBgNVBAgMCUthcm5hdGFrYTERMA8GA1UEBwwI
SHViYmFsbGkxEDAOBgNVBAoMB05pY2VITVMxEDAOBgNVBAsMB05pY2VITVMxIDAe
BgNVBAMMF2h0dHBzTC8vd3d3Lm5pY2VobXMuY29tMSAwHgYJKoZIhvcNAQkBFhFh
ZG1pbkBuaWNlaG1zLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEB
AJORXsBvl5cSyotR/Ji5ntwQqaxC0CN4AGHM/KnSWig0M+4Q6Bcv5UEK+Df5GOmf
/aJP9PI7XdPL1s1O/mRrMm73snqKaGwSVRxa6xeUWfbi4dt44keHcNuHJewdgIVd
JUH9s5LJz/nEhTa49WkUotpKb+NszcFPtJtJBTxyyf7UoF1SpWjWOuekYQzkdh28
JouyCT+ZN1Kqhti79exU0O7o98h29EYHZqhnTXg2wNB7w1o96jILTxhfP0ozCWpV
TEE6jXKXsVXm+fF0iPb4Rm7qLWPXErtU9nRoTRihHjQcSKhF163tHcWzcZ/ujhQr
21U95GwuvaiL+dzbUDt0q60CAwEAAaMhMB8wHQYDVR0OBBYEFK+3m0BftTPuvYRe
1ERQoKNhYBOuMA0GCSqGSIb3DQEBCwUAA4IBAQBrq4KSQr0fdh8z15lQ4ZFfBNN9
3yZQEs5rzo6/ajGC5ML8O+ORcoIHkNfUlui16lGJ9ZH/6rptSWmGOv3c17gV0/gO
M+EaxF4cqbeaiAx9epZmM9eRHwqL+m1V0afQrinr8rrng6KFzE3HpYP/T65Cc5tB
UhIi2LNMYgf1+qpo1PWmwlMZXAXZQGBqWLVoDXvRk6OjZyT1Ld8hCGhDF4/1PmCr
GN6wtDmUBlcdtUzpQlpvY37iIesI9PdbhSWQyftGiK3nwx+ilhFhzXRxGecd/VTJ
V/6YoHaAfVfnuzA8CaiS0E6U6TEftvWNoDv5VjETGs6Ot1Vwb4FjyweXTOEL
-----END CERTIFICATE-----`


const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCTkV7Ab5eXEsqL
UfyYuZ7cEKmsQtAjeABhzPyp0looNDPuEOgXL+VBCvg3+Rjpn/2iT/TyO13Ty9bN
Tv5kazJu97J6imhsElUcWusXlFn24uHbeOJHh3DbhyXsHYCFXSVB/bOSyc/5xIU2
uPVpFKLaSm/jbM3BT7SbSQU8csn+1KBdUqVo1jrnpGEM5HYdvCaLsgk/mTdSqobY
u/XsVNDu6PfIdvRGB2aoZ014NsDQe8NaPeoyC08YXz9KMwlqVUxBOo1yl7FV5vnx
dIj2+EZu6i1j1xK7VPZ0aE0YoR40HEioRdet7R3Fs3Gf7o4UK9tVPeRsLr2oi/nc
21A7dKutAgMBAAECggEACnTupexCba4jNCQnJhthKm7z1wUVAq5qOIPyE4aYZOju
FRyVla8LK8S/Ohgor8Vqj6nizZdvWqbDHeFPHYaLGFntB8nvBFl4Nn4q0ozsoxYI
syipwC/Uy3mUMlsU1F55WWfE5c3vMt++INaSbVPNBnLn4tG+8sfXIHnYKSRpM+l5
r8J+Q0wCDv9WGp1guFVESMvKEKXvGBW605M1p2VRB/LS58yDuGSMKZOea2hZtyjF
OATg8wu55/IIrIlexe6vosN5myu0TSfwlAe1UyeLWmpIuTX9KxEAiRs20bw+oMJh
uTb4nzuYLaR4eyyjdschiq1xEYHXYxRrL42E/bMRcQKBgQDL6TaLtSldsln6XBBO
JlpYCngwa3y7IlHQrAuECIIHoTnSpex4Kca5Ptj6vXYy5U4XZbBTmEtM6SXnDa8j
WS6uCljHtFkrgqrTB58lyL3Yx/eIFSEL5XZvQFkdUkXAGTEJ3LncrTdLKysJ2v/O
L2+ia/f1g+IJrBKzz/2gDfuESwKBgQC5Q5cHFMpWGMTwLMcu7ZIP4SOjqf7zzw+Q
1pUJAk8f49o0pVREtwdRIFy2AgqUj4i3mSaPxO5Czxbpn9kMsV+kFoR7EYVVDBxN
8YkFFwciWpCSJt8hBEZnxrSQvgeOx7wkW36mNZ5C/YBZrUcGQ9kXEzlg9rEzms2Z
nwSvx5lk5wKBgDf7sm8O8Ol5kvyKlCtwmjM7xJ2+lQMnvACni43XbCO+Hwr3ZQHk
rlujppzIsY/tptADqjJ5SIs4I6DY//GbhZZg3tkNacHpYQ8JM6eDAqRm2k3xRx5m
BGss5oqHUQEZqX4ErL6qi9jGZE2TY9Hu8h5MuEoeyEtRg9z8SKzNyfUbAoGAe5Zq
PrAQ1mSJpArLCTQ0duFizABQcsaThLSREUR4EjcGzo3n7DsI54amMkikVDx4ILpK
7ieaJflOOKWIvp3oxma7E/o5LuX4T8qr9DhLaxBtVwIVYUofyYTV2aTbF9WIXdyn
XStxmxDPOYONWNGUFX+ejF+lEF7ZfvyEvNpzKssCgYBHzrISJC6W6bc1YcDdQkIr
HWNN7iGFIhVBpyP4MHsRUD8fXCnkPFz2V4CignfvgNejs/uNK42iZKOMaHN3QG2f
4t8QSaItsHEmETC80Z973Db6vHVyC15WBkHYwfaEkZLmfzcE2gmW8Q7rbjsU/Mhc
u2t/vioO2q3K45uZps5XHA==
-----END PRIVATE KEY-----`
const createProvider = async () => {
  const curPart = await participate();

  // const res = await curPart.create({
  //   linked_registry_codes: ["10001"],
  //   registryid: "IN2910000010",
  //   participant_name: "Jeevan Jyoti Hospital",
  //   scheme_code: "PMJAY",
  //   state: "Karnataka",
  //   district: "Dharawad",
  //   roles: ["10001"],
  //   primaryEmail: "umeshbilagi@gmail.com",
  //   phone: ["9343403620"],
  //   primaryMobile: "9343403620",
  //   signing_cert_path: "www.nicehms.com/api/hcx/public-key",
  //   encryption_cert:
  //   Buffer.from(public_certicate, 'utf-8').toString('base64'),
  // });

  const res = await curPart.create({
    district: 'Dharwad',
    state: 'KARNATAKA',
    endpoint_url: 'https://webhook.site/e5f0afd8-f9e5-4b5d-9cf3-62d960bd0bec/api/callback',
    linked_registry_codes: [ '10001' ],
    participant_name: 'Jeevan Jyoti Hospital',
    phone: [ '09343403620' ],
    primaryEmail: 'umeshbilagi@gmail.com',
    primaryMobile: '9343403620',
    registryid: 'IN2910000010',
    roles: [ '10001' ],
    scheme_code: 'PMJAY',
    signing_cert_path: 'www.nicehms.com/api/hcx/public-key',
    encryption_cert: 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCiAgICBNSUlENlRDQ0F0R2dBd0lCQWdJVU1hd0xtQlNhSVZUOStIRHkzOG1ZQ0E1QlB4NHdEUVlKS29aSWh2Y05BUUVMCiAgICBCUUF3Z1p3eEN6QUpCZ05WQkFZVEFrbE9NUkl3RUFZRFZRUUlEQWxMWVhKdVlYUmhhMkV4RVRBUEJnTlZCQWNNCiAgICBDRWgxWW1KaGJHeHBNUkF3RGdZRFZRUUtEQWRPYVdObFNFMVRNUkF3RGdZRFZRUUxEQWRPYVdObFNFMVRNU0F3CiAgICBIZ1lEVlFRRERCZG9kSFJ3YzB3dkwzZDNkeTV1YVdObGFHMXpMbU52YlRFZ01CNEdDU3FHU0liM0RRRUpBUllSCiAgICBZV1J0YVc1QWJtbGpaV2h0Y3k1amIyMHdIaGNOTWpReE1qSXlNRGt5TWpNeFdoY05NalV4TWpJeU1Ea3lNak14CiAgICBXakNCbkRFTE1Ba0dBMVVFQmhNQ1NVNHhFakFRQmdOVkJBZ01DVXRoY201aGRHRnJZVEVSTUE4R0ExVUVCd3dJCiAgICBTSFZpWW1Gc2JHa3hFREFPQmdOVkJBb01CMDVwWTJWSVRWTXhFREFPQmdOVkJBc01CMDVwWTJWSVRWTXhJREFlCiAgICBCZ05WQkFNTUYyaDBkSEJ6VEM4dmQzZDNMbTVwWTJWb2JYTXVZMjl0TVNBd0hnWUpLb1pJaHZjTkFRa0JGaEZoCiAgICBaRzFwYmtCdWFXTmxhRzF6TG1OdmJUQ0NBU0l3RFFZSktvWklodmNOQVFFQkJRQURnZ0VQQURDQ0FRb0NnZ0VCCiAgICBBSk9SWHNCdmw1Y1N5b3RSL0ppNW50d1FxYXhDMENONEFHSE0vS25TV2lnME0rNFE2QmN2NVVFSytEZjVHT21mCiAgICAvYUpQOVBJN1hkUEwxczFPL21Sck1tNzNzbnFLYUd3U1ZSeGE2eGVVV2ZiaTRkdDQ0a2VIY051SEpld2RnSVZkCiAgICBKVUg5czVMSnovbkVoVGE0OVdrVW90cEtiK05zemNGUHRKdEpCVHh5eWY3VW9GMVNwV2pXT3Vla1lRemtkaDI4CiAgICBKb3V5Q1QrWk4xS3FodGk3OWV4VTBPN285OGgyOUVZSFpxaG5UWGcyd05CN3cxbzk2aklMVHhoZlAwb3pDV3BWCiAgICBURUU2alhLWHNWWG0rZkYwaVBiNFJtN3FMV1BYRXJ0VTluUm9UUmloSGpRY1NLaEYxNjN0SGNXemNaL3VqaFFyCiAgICAyMVU5NUd3dXZhaUwrZHpiVUR0MHE2MENBd0VBQWFNaE1COHdIUVlEVlIwT0JCWUVGSyszbTBCZnRUUHV2WVJlCiAgICAxRVJRb0tOaFlCT3VNQTBHQ1NxR1NJYjNEUUVCQ3dVQUE0SUJBUUJycTRLU1FyMGZkaDh6MTVsUTRaRmZCTk45CiAgICAzeVpRRXM1cnpvNi9hakdDNU1MOE8rT1Jjb0lIa05mVWx1aTE2bEdKOVpILzZycHRTV21HT3YzYzE3Z1YwL2dPCiAgICBNK0VheEY0Y3FiZWFpQXg5ZXBabU05ZVJId3FMK20xVjBhZlFyaW5yOHJybmc2S0Z6RTNIcFlQL1Q2NUNjNXRCCiAgICBVaElpMkxOTVlnZjErcXBvMVBXbXdsTVpYQVhaUUdCcVdMVm9EWHZSazZPalp5VDFMZDhoQ0doREY0LzFQbUNyCiAgICBHTjZ3dERtVUJsY2R0VXpwUWxwdlkzN2lJZXNJOVBkYmhTV1F5ZnRHaUszbnd4K2lsaEZoelhSeEdlY2QvVlRKCiAgICBWLzZZb0hhQWZWZm51ekE4Q2FpUzBFNlU2VEVmdHZXTm9EdjVWakVUR3M2T3QxVndiNEZqeXdlWFRPRUwKICAgIC0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0='
  })


  try {
    const res = await curPart.v2Create({
      "email" :"ramyakalyanpur@gmail.com",
      "endpointurl": this.endpointUrl,
      "mobilenumber" : "9343403620",
      "registryid" :  "IN2910000010",
      "registrytype" : "10001",
      "role" : ["10001"]
    })
  
    console.log(res);
  } catch (error) {
    console.log(error)
  }

};

const createPayor = async () => {
  const curPart = await participate();
  const res = await curPart.create({
    encryption_cert: process.env.NHCX_PUBLIC_KEY,
    address: {
      description: "Physical address of the facility including its geolocation",
      default_address: {
        city: "Hubli",
        country: "India",
        description: "Default address details",
        postal_code: "580020",
        state: "Karnataka",
        street: "HNo 11, Near pilley school",
      },
    },
    scheme_code: "PMJAY",
    payment_details: {
      description: "Default payment details (UPI or A/C Number + IFSC Code)",
      default_payment: {
        description: "Default payment details",
        account_number: "1234567788",
        ifsc_code: "DFG123",
        UPI: "246567289@ybl",
      },
    },
    participant_name: "My TQP",
    registryid: "IN0000T457",
    phone: ["083622062624"],
    primaryEmail: "adbilagi@gmail.com",
    roles: ["10003"],
    state: "Karanataka",
    district: "Dharaead",
  });

  console.log(res);
};

const update = async () => {
  const curPart = await participate();
  // const res = await curPart.update({
  //   "participant_code" : "1000003415@hcx",
  //   linked_registry_codes: ["10001"],
  //   registryid: "IN291000002909",
  //   participant_name: "Jeevan Jyoti Hospital",
  //   scheme_code: "PMJAY",
  //   state: "Karnataka",
  //   district: "Dharawad",
  //   roles: ["10001"],
  //   primaryEmail: "umeshbilagi@gmail.com",
  //   phone: ["9343403620"],
  //   primaryMobile: "9343403620",
  //   signing_cert_path: "www.nicehms.com/api/hcx/public-key",
  //   encryption_cert:
  //     Buffer.from(public_certicate, "utf-8").toString("base64"),
  //   endpoint_url: "webhook.site/e68c983f-7b9f-4d9f-8136-535ff81c0120",
  // });



  try {
    
    const res = await curPart.v2Update({
      "participantcode": "IN2910004474@hcx",
      "encryptioncert" : this.endpointUrl,
      "encryptioncert": Buffer.from(public_certicate, "utf-8").toString("base64"),
    })
    console.log(res);
  } catch (error) {
   console.log(error) 
  }


};

const getList = async () => {
  try {
    const curPart = await participate();

    const res = await curPart.fetchPartipants("PAYER");
    console.log(JSON.stringify(res.data));
  } catch (error) {
    console.log(error.response.data);
  }

  // console.log(res.data.participantdetails.filter(el=> el.participantcode == "1000000423@sbx"))

  // get payer
  //

  //  console.log(res.data.participantdetails.filter(el=> el.participantcode == "1000000590@sbx"))
};

const getCert = async (id) => {
  const curPart = await participate();
  const res = await curPart.fetchCert(id);
  console.log(res)
};

const search = async (id) => {
  const curPart = await participate();
  res = await curPart.search(id);

  console.log(res);
};

const getPlicies = async () => {
  const curPart = await participate();
  const res = await curPart.getPolicies({
    identifiertype: "AbhaNumber",
    identifiervalue: "59457654551034",
  }).catch(err=>console.log(err));
  console.log(res.data);
};
const updateCert = async () => {
  const fs = require("fs");
  const publicCert = fs.readFileSync("./keys/public_cert.pem", "utf8");

  const curPart = await participate();
  const res = await curPart.participantCertUpdtae({
    encryptioncert: "MIIDzzCCAregAwIBAgIUHbWsq3tUdgYxdBiYJLo8OzSElh0wDQYJKoZIhvcNAQEL BQAwgY8xCzAJBgNVBAYTAlVTMQ4wDAYDVQQIDAVTdGF0ZTENMAsGA1UEBwwEQ2l0 eTEVMBMGA1UECgwMT3JnYW5pemF0aW9uMQ0wCwYDVQQLDARVbml0MRQwEgYDVQQD DAtleGFtcGxlLmNvbTElMCMGCSqGSIb3DQEJARYWeW91cl9lbWFpbEBleGFtcGxl LmNvbTAeFw0yNDA1MDcxMzUzNTlaFw0yNTA1MDcxMzUzNTlaMIGPMQswCQYDVQQG EwJVUzEOMAwGA1UECAwFU3RhdGUxDTALBgNVBAcMBENpdHkxFTATBgNVBAoMDE9y Z2FuaXphdGlvbjENMAsGA1UECwwEVW5pdDEUMBIGA1UEAwwLZXhhbXBsZS5jb20x JTAjBgkqhkiG9w0BCQEWFnlvdXJfZW1haWxAZXhhbXBsZS5jb20wggEiMA0GCSqG SIb3DQEBAQUAA4IBDwAwggEKAoIBAQDyjnu8welc9GdtbByv21J5mNBNN3s1CKZi rEGBUrJOkK8Rz4I3eDLN51rSKYlPnVu8piQRR898ArBF6SsV+Pn45WjMTHnfI4mK K1zl+FolE6he6XzpwV8eFsqJQYYl3CG03z3+nIUb/CKsYuJgrlOVbtkloI5ljSf0 Hw+kfjOM0FDBVQTt0UfeNuqbLBJ2YxPAbzb2IhrlzYuf60xCqbMnCRutAd3ZY8Yq D6SHSZg7eBLESnHU+tqsof42y+N/vFDROdc/fIfG34Amo8mUwBoQv9bxn0s5Jrff blxzBshP3q34ubKvhWUbWxXPts69v8OjJtOTqP7UWm9Y5EOMjhFhAgMBAAGjITAf MB0GA1UdDgQWBBR2/iJ52wm6WZxFNP08VtfrlUPZWjANBgkqhkiG9w0BAQsFAAOC AQEAYuYoCgnjF9d3Px2WVVKp/t348gWOS12OsBY2vANpavlJPIrUe2uu35WyYQ88 2K8SHbwufgixG0HN//jYNKkJL7lIgaiejJ9d9PVdGU509MO+0Z12O/ErzGJjhJcd NwFpmFoEHLZp6tCkWfwMeogsM30p5X/aFCE+JJ3trXzbK6y14/DEi/a3PSN49CZA xS6s+UvCiVt7TKS2/wVjKqgKNxVufWR8ntPVGdz0sKQORl6Lj9TbL+rbaHsaqubm zdU5pYXzI/ph8G4LcwQtdWvn3WkTNn6S7jgc3QBLIVMythpwvKqLKiOfXWq7/vg9 t6E0JJYh+AO9emEnGGVtvPAyBw==",
    endpointurl: "webhook.site/e68c983f-7b9f-4d9f-8136-535ff81c0120",
    participantcode: "1000003415@hcx",
  });

  console.log(res);
};

let  id="1000003538@hcx"
// 1000003415@hcx
// 1000003415@hcx
createProvider();

// createPayor();
// update()
// getList()

// getCert(id)
// search(id)
// getPlicies()
// updateCert()

// let encodedData = "MCowBQYDK2VwAyEAfeyB5GnUMnUeqPfW180FGS+s7N8dWmH6X4ZG2x9Vd/Y=";
// let decodedData = atob(encodedData);

// console.log(decodedData);

// console.log(Buffer.from(public_certicate, 'utf-8').toString('base64'))

module.exports = { getCert };
