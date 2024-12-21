import { AlexaRequestEnvelope, AlexaRequestType } from './types';

export function getRequestName(request: AlexaRequestEnvelope): string {
    return request.directive.header.name;
}

export function getRequestType(request: AlexaRequestEnvelope): AlexaRequestType {
    return request.directive.header.namespace;
}
