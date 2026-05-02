
export default class Request {
  async request(config: {
    headers: any;
    requestBody: any;
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  }): Promise<any> {
    const body = JSON.stringify(config.requestBody);
    const requestBody = {
      headers: config.headers,
      body: body,
      url: config.url,
      method: config.method,
    };
    try {
      const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body: body,
      });
      const text = await response.text();
      return { body: text };
    } catch (err) {
      console.log("ABDM request sent", JSON.stringify(requestBody), "ERROR", JSON.stringify(err));
      throw err;
    }
  }
}
