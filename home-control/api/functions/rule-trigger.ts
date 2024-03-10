import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ApiGatewayEvent } from "../types/api-gateway-event";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import * as mqtt from "mqtt";
import { jsonResponse } from "../types/json-response";

type Rule = {
  id: string;
  destinationTopic: string;
  rulePayload: string;
};

type TriggerMessage = {
  originTopic: string;
  payload: Record<string, any>;
};

const dynamoDbClient = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(dynamoDbClient);
const tableName = "homeRules";

module.exports.handler = async (event: ApiGatewayEvent) => {
  try {
    const triggerMessage = JSON.parse(event.body) as TriggerMessage;
    const originTopic = triggerMessage.originTopic;
    const action = triggerMessage.payload["action"];

    console.log(
      "INFO: Received message from %s: %s",
      triggerMessage.originTopic,
      JSON.stringify(triggerMessage.payload)
    );

    if (!action) {
      console.log(
        "INFO: There is any action available for the message received."
      );
    } else {
      const rules = await findRulesToTrigger(originTopic, action);
      
      console.log("%d rules found", rules.Count);
      if (rules.Count === 0) {
        return jsonResponse(404, undefined);
      } else {
        await triggerRules(rules.Items as Rule[]);
        return jsonResponse(200, rules.Items);
      }
    }
  } catch (e: any) {
    console.error("ERROR: %s", e.message);
    return jsonResponse(500, e);
  }
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
    const MQTT_URL = process.env.MQTT_URL ?? "Undefined";
    const mqttClient = await mqtt.connectAsync(MQTT_URL);

    console.log("INFO: MQTT Connection open");

    for (const rule of rules) {
      await mqttClient.publishAsync(rule.destinationTopic, rule.rulePayload);

      console.log(
        "INFO: MQTT payload sent:  %s - %s",
        rule.destinationTopic,
        JSON.stringify(rule.rulePayload, null, 2)
      );
    }

    await mqttClient.endAsync();

    console.log("INFO: MQTT Client disconnected");
  } catch (err) {
    console.error(err);
  }
}
