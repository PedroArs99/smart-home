import { AlexaEventEnvelope } from './types';

export function handleAuthorization(request: AlexaEventEnvelope, context: any) {
  // Send the AcceptGrant response
  const payload = {};
  const header = request.directive.header;
  header.name = 'AcceptGrant.Response';
  console.debug('AcceptGrant Response: ', JSON.stringify({ header: header, payload: payload }));
  context.succeed({ event: { header: header, payload: payload } });
}
