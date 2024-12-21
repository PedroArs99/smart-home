export type AlexaRequestType = 'Alexa.Authorization' | 'Alexa.Discovery' | 'Alexa.PowerController';

export interface AlexaRequestEnvelope {
    directive: {
        header: {
            namespace: AlexaRequestType;
            name: string;
        };
    };
}
