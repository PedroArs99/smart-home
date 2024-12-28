export type AlexaNamespace =
  | 'Alexa'
  | 'Alexa.Authorization'
  | 'Alexa.Discovery'
  | 'Alexa.EndpointHealth'
  | 'Alexa.PowerController';

export interface AlexaRequestEnvelope {
  directive: {
    header: {
      namespace: AlexaNamespace;
      name: string;
      messageId: string;
      correlationToken: string;
    };
    endpoint: {
      scope: {
        type: 'BearerToken';
        token: string;
      };
      endpointId: string;
    };
    payload: any;
  };
}

interface ContextProperty {
  namespace: AlexaNamespace;
  name: string;
  value: any;
  timeOfSample: Date;
  uncertaintyInMilliseconds: number;
}

export interface AlexaResponse {
  context: {
    properties: ContextProperty[];
  };
  event: {
    endpoint: {
      scope: {
        type: 'BearerToken';
        token: string;
      };
      endpointId: string;
    };
    header: {
      correlationToken: string;
      name: string;
      namespace: AlexaNamespace;
      messageId: string;
      payloadVersion: '3';
    };
    payload: any;
  };
}

export interface DeviceStatus {
  state: 'ON' | 'OFF';
}
