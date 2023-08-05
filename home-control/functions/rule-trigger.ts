import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SnsEvent } from "../types/SnsEvent";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

type ControllerMessage = {
  action: string;
};

type Rule = {
  id: string;
  destinationTopic: string;
  rulePayload: string;
};

const dynamoDbClient = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(dynamoDbClient);
const tableName = "homeRules";

const sqsClient = new SQSClient({});

module.exports.handler = async (event: SnsEvent) => {
  const records = event.Records;

  for(const record of records) {
    const originTopic = record.Sns.Subject;
    const message: ControllerMessage = JSON.parse(record.Sns.Message);
    const action = message.action;

    console.log("Received message from %s", originTopic);

    const rules = await findRulesToTrigger(originTopic, action);

    console.log("%d rules found", rules.Count);

    await triggerRules(rules.Items as Rule[]);
  };
};

async function findRulesToTrigger(originTopic: string, action: string) {
  const query = new ScanCommand({
    TableName: tableName,
    FilterExpression:
      "#originTopic = :originTopic AND #triggerAction = :triggerAction",
    ExpressionAttributeNames: {
      "#originTopic": "originTopic",
      "#triggerAction": "triggerAction",
    },
    ExpressionAttributeValues: {
      ":originTopic": originTopic,
      ":triggerAction": action,
    },
  });

  return dynamodb.send(query);
}

async function triggerRules(rules: Rule[]) {
  for (const rule of rules) {
    await publishSqsRule(rule.destinationTopic, rule.rulePayload);
  }
}

async function publishSqsRule(destinationTopic: string, rulePayload: any) {
  try {
    const command = new SendMessageCommand({
      QueueUrl: "https://sqs.eu-central-1.amazonaws.com/584871003262/HomeControlRuleQueue",
      MessageAttributes: {
        Origin: {
          DataType: 'String',
          StringValue: 'Home-Control',
        }
      },
      MessageBody: JSON.stringify({
        destinationTopic,
        rulePayload
      })
    });

    const result = await sqsClient.send(command);
    console.log("Rule pushed to SQS: %s", JSON.stringify(result, null, 2));

  } catch (err) {
    console.error(err);
  }
}
