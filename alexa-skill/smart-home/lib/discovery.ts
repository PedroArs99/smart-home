import { AlexaRequestEnvelope } from './types';
import * as devices from './devices.json';

export function handleDiscovery(request: AlexaRequestEnvelope, context: any) {
  const header = request.directive.header;
  header.name = 'Discover.Response';
  console.debug('Discovery Response: ', JSON.stringify({ header: header, payload: devices }));
  context.succeed({ event: { header: header, payload: devices } });
}
