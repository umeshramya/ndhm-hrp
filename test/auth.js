const { Register, Patient } = require("ndhm-hpr")

const auth = async () => {
    const accessToken = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJBbFJiNVdDbThUbTlFSl9JZk85ejA2ajlvQ3Y1MXBLS0ZrbkdiX1RCdkswIn0.eyJleHAiOjE2MzQ1NTIwMzQsImlhdCI6MTYzNDU1MTQzNCwianRpIjoiNzdmNzM5MWItOTg3Zi00MTczLTk5NDMtMGM0YWM1Nzk2ZmVkIiwiaXNzIjoiaHR0cHM6Ly9kZXYubmRobS5nb3YuaW4vYXV0aC9yZWFsbXMvY2VudHJhbC1yZWdpc3RyeSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJmYWZkNjA3YS1lZjAwLTQzM2MtYTQ4ZC1jOWJjMDcwNDkyNGUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJTQlhfMDAwNjc2Iiwic2Vzc2lvbl9zdGF0ZSI6IjRlZGU1ODc3LTdjNjItNGQyMi04MGZkLWNhYzkzYjMyMWE0MSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo5MDA3Il0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImhpcCJdfSwicmVzb3VyY2VfYWNjZXNzIjp7IlNCWF8wMDA2NzYiOnsicm9sZXMiOlsidW1hX3Byb3RlY3Rpb24iXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUiLCJjbGllbnRJZCI6IlNCWF8wMDA2NzYiLCJjbGllbnRIb3N0IjoiMTAuMjMzLjY4LjQ4IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtc2J4XzAwMDY3NiIsImNsaWVudEFkZHJlc3MiOiIxMC4yMzMuNjguNDgifQ.VvN3bJterWh0f8VYfJRT4bZQdUkN_kvGBy0vg7jOPA0r5t2BUlk0tSzaBNckyc5FoGrNNFycgJb6A1p_R54bpnB9uNp3GGeq_MMtPZ0aPfGWSLIdNLsM_OhQgA1CRyjRGQxPPTylUXm6lKcC44u0yiRp1ZgkWcmvksjtmtwSpNHgoCinMmVThnsSjEU4qIR0b0DEHEB9HdQHrXDmV1dI-kR4YFIdPZNu6-oDcT0ADY4xl9QrOpUuLtRUc1pNxPysNXXZZhDJWCSaxHIaB_eNLMf_bBWk9RFJUl0AdimUHaal-z45B_Rc5CMLRaH2PLOFIGe7LPz3NSESxqPWBl66jg"
    const authCode = "903532"
    const transactionId = "10424d2c-72a1-4229-b710-3ebb17889611"
    const patient = new Patient("https://dev.ndhm.gov.in/", accessToken, "sbx")
    await patient.hipAuthConfirm({
        "authCode": authCode,
        "transactionId": transactionId,
    })

    await patient.hipPatientAddContext({
        "careContextAccessToken": "",
        "patientId": 123,
        "patinetDisplay": "Umesh R Bilagi",
        "careContextId": 5678,
        "careContextDisplay": "OPD"
    })

}



auth()