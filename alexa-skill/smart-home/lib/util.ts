import { AlexaNamespace, AlexaRequestEnvelope } from './types';

export function getRequestName(request: AlexaRequestEnvelope): string {
  return request.directive.header.name;
}

export function getRequestType(request: AlexaRequestEnvelope): AlexaNamespace {
  return request.directive.header.namespace;
}