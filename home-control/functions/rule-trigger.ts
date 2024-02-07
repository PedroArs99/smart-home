import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SnsEvent } from "../types/SnsEvent";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import * as mqtt from "mqtt";

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
  try {
    const MQTT_URL = process.env.MQTT_URL ?? 'Undefined';
    const mqttClient = await mqtt.connectAsync(MQTT_URL);

    console.log("INFO: MQTT Connection open")

    for (const rule of rules) {
      await mqttClient.publishAsync(
        rule.destinationTopic,
        rule.rulePayload
      );

      console.log(
        "INFO: MQTT payload sent:  %s - %s",
        rule.destinationTopic,
        JSON.stringify(rule.rulePayload, null, 2)
      );
    }

    await mqttClient.endAsync()

    console.log("INFO: MQTT Client disconnected")
  } catch (err) {
    console.error(err);
  }
}
