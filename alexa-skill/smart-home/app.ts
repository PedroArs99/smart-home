import { handleAuthorization } from './lib/authorization';
import { handleDiscovery } from './lib/discovery';
import { handlePowerControl } from './lib/hardware/powerController';
import { AlexaRequestEnvelope } from './lib/types';
import { getRequestName, getRequestType } from './lib/util';

export const lambdaHandler = async (request: AlexaRequestEnvelope, context: any): Promise<void> => {
  if (getRequestType(request) === 'Alexa.Discovery' && getRequestName(request) === 'Discover') {
    console.debug('Discover request', JSON.stringify(request));
    handleDiscovery(request, context);
  } else if (getRequestType(request) === 'Alexa.Authorization' && getRequestName(request) === 'AcceptGrant') {
    handleAuthorization(request, context);
  } else if (getRequestType(request) === 'Alexa.PowerController') {
    console.debug('Power request', JSON.stringify(request));
    await handlePowerControl(request, context);
  } else {
    console.warn('Unsupported Request', JSON.stringify(request));
  }
};
