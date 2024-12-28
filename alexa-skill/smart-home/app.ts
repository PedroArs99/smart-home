import { handleAuthorization } from './lib/authorization';
import { handleDiscovery } from './lib/discovery';
import { handlePowerControl } from './lib/hardware/powerController';
import { handleReportState } from './lib/hardware/reportState';
import { AlexaRequestEnvelope } from './lib/types';
import { getRequestName, getRequestType } from './lib/util';

export const lambdaHandler = async (request: AlexaRequestEnvelope, context: any): Promise<void> => {
  const requestType = getRequestType(request);
  const requestName = getRequestName(request);

  if (requestType === 'Alexa.Discovery' && requestName === 'Discover') {
    console.debug('Discover request - ', JSON.stringify(request));
    handleDiscovery(request, context);
  } else if (requestType === 'Alexa.Authorization' && requestName === 'AcceptGrant') {
    handleAuthorization(request, context);
  } else if (requestType === 'Alexa' && requestName === 'ReportState') {
    console.debug('Report State Request - ', JSON.stringify(request));
    await handleReportState(request, context);
  } else if (requestType === 'Alexa.PowerController') {
    console.debug('Power request - ', JSON.stringify(request));
    await handlePowerControl(request, context);
  } else {
    console.debug('Unsupported Request - ', JSON.stringify(request));
  }
};
