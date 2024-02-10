export function jsonResponse(statusCode: number, body: any) {
  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
    statusCode,
  };
}
