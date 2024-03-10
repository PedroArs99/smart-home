export function jsonResponse(statusCode: number, body: any) {
  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
    statusCode,
  };
}
