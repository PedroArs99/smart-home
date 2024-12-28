import { sendSqsMessage } from '../messaging/sqs';
import { AlexaRequestEnvelope, AlexaResponse } from '../types';
import { getRequestType } from '../util';

type PowerControlRpiEvent = {
  deviceName: string;
  payload: {
    state: 'ON' | 'OFF';
  };
};

function prepareResponse(request: AlexaRequestEnvelope, powerResult: 'ON' | 'OFF'): AlexaResponse {
  return {
    context: {
      properties: [
        {
          namespace: 'Alexa.PowerController',
          name: 'powerState',
          value: powerResult,
          timeOfSample: new Date(), //retrieve from result.
          uncertaintyInMilliseconds: 1000,
        },
        {
          namespace: 'Alexa.EndpointHealth',
          name: 'connectivity',
          value: {
            value: 'OK',
          },
          timeOfSample: new Date(),
          uncertaintyInMilliseconds: 0,
        },
      ],
    },
    event: {
      header: {
        correlationToken: request.directive.header.correlationToken,
        namespace: 'Alexa',
        name: 'Response',
        messageId: request.directive.header.messageId + '-R',
        payloadVersion: '3',
      },
      endpoint: {
        scope: {
          type: 'BearerToken',
          token: request.directive.endpoint.scope.token,
        },
        endpointId: request.directive.endpoint.endpointId,
      },
      payload: {},
    },
  };
}

export async function handlePowerControl(request: AlexaRequestEnvelope, context: any) {
  let powerResult: 'ON' | 'OFF';

  const requestMethod = request.directive.header.name;
  const deviceName = request.directive.endpoint.endpointId;
  const namespace = getRequestType(request);
  const messageId = request.directive.header.messageId;

  if (requestMethod === 'TurnOn') {
    const payload: PowerControlRpiEvent = {
      deviceName,
      payload: {
        state: 'ON',
      },
    };

    await sendSqsMessage(deviceName, namespace, messageId, payload);
    powerResult = 'ON';
  } else if (requestMethod === 'TurnOff') {
    const payload: PowerControlRpiEvent = {
      deviceName,
      payload: {
        state: 'OFF',
      },
    };

    await sendSqsMessage(deviceName, namespace, messageId, payload);
    powerResult = 'OFF';
  } else {
    console.debug('Power Request %s not supported', requestMethod);
    return;
  }

  const response = prepareResponse(request, powerResult);

  console.debug('Alexa.PowerController ', JSON.stringify(response));
  context.succeed(response);
}
