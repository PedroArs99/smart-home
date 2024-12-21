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
  event: {
    context: {
      properties: ContextProperty[];
    };
    endpoint: {
      scope: {
        type: 'BearerToken';
        token: string;
      };
      endpointId: string;
    };
    header: {
      namespace: AlexaNamespace;
      name: string;
      messageId: string;
    };
    payload: any;
  };
}
