import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const client = new SQSClient({ region: process.env.REGION });
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;

export async function sendSqsMessage(deviceName: string, eventNamespace: string, payload: any) {
  const command = new SendMessageCommand({
    QueueUrl: SQS_QUEUE_URL,
    MessageAttributes: {
      Title: {
        DataType: 'String',
        StringValue: `${deviceName}-${eventNamespace}`,
      },
    },
    MessageBody: JSON.stringify(payload),
    MessageGroupId: deviceName,
  });

  const response = await client.send(command);
  console.debug('SQS Response: ', JSON.stringify(response));

  return response;
}
