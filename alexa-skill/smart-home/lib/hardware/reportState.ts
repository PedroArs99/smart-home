import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { AlexaRequestEnvelope, AlexaResponse, DeviceStatus } from '../types';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const dynamoDbClient = new DynamoDBClient();
const tableName = process.env.DB_TABLE_NAME;

function prepareResponse(request: AlexaRequestEnvelope, deviceState: DeviceStatus): AlexaResponse {
  return {
    context: {
      properties: [
        {
          namespace: 'Alexa.PowerController',
          name: 'powerState',
          value: deviceState.state,
          timeOfSample: new Date(),
          uncertaintyInMilliseconds: 50,
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
        name: 'StateReport',
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

export async function handleReportState(request: AlexaRequestEnvelope, context: any) {
  const deviceName = request.directive.endpoint.endpointId;

  const query = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: 'deviceName = :deviceName',
    ExpressionAttributeValues: marshall({
      ':deviceName': deviceName,
    }),
  });

  const result = await dynamoDbClient.send(query);

  if (result.Count === 1) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const deviceEntry = unmarshall(result.Items![0]);
    const response = prepareResponse(request, deviceEntry.status);

    console.debug('Alexa ReportState - ', JSON.stringify(response));

    context.succeed(response);
  } else {
    console.debug('No devices found for the ReportState directive.');
    return;
  }
}
