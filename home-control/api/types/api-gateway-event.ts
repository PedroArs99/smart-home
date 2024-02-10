export interface ApiGatewayEvent {
  body: string;
  pathParameters: Record<string, string>;
}