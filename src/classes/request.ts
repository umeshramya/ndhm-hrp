
// export default class Request {
//   async request(config: {
//     headers: any;
//     requestBody: any;
//     url: string;
//     method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
//   }): Promise<any> {
//     const body = JSON.stringify(config.requestBody);
//     const requestBody = {
//       headers: config.headers,
//       body: body,
//       url: config.url,
//       method: config.method,
//     };
//     try {
//       const response = await fetch(config.url, {
//         method: config.method,
//         headers: config.headers,
//         body: body,
//       });
//       const text = await response.text();
//       return { body: text, status: response.status, statusText: response.statusText };
//     } catch (err) {
//       console.log("ABDM request sent", JSON.stringify(requestBody), "ERROR", JSON.stringify(err));
//       throw err;
//     }
//   }
// }


export default class Request {
  async request(config: {
    headers: any;
    requestBody?: any;
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  }): Promise<{
    body: string;
    status: number;
    statusText: string;
    headers: Headers;
  }> {

    const isBodyAllowed = !["GET", "HEAD"].includes(config.method);

    const body = isBodyAllowed && config.requestBody
      ? JSON.stringify(config.requestBody)
      : undefined;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const text = await response.text();

      return {
        body: text,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };

    } catch (err: any) {
      clearTimeout(timeout);

      console.error("ABDM REQUEST FAILED");
      console.error("URL:", config.url);
      console.error("METHOD:", config.method);
      console.error("HEADERS:", config.headers);
      console.error("BODY:", body);
      console.error("ERROR:", err?.message || err);

      throw err;
    }
  }
}