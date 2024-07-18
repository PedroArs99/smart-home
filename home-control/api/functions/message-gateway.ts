import { ApiGatewayEvent } from "../types/api-gateway-event";
import * as mqtt from "mqtt";
import { jsonResponse } from "../types/json-response";

module.exports.handler = async (event: ApiGatewayEvent) => {
  try {
    const message = JSON.parse(event.body);
    const destinationTopic: string = event.pathParameters.topic;

    console.log(
      "INFO: Trying to send payload:  %s - %s",
      destinationTopic,
      JSON.stringify(message, null, 2)
    );

    await postMessage(destinationTopic, JSON.stringify(message));

    return jsonResponse(200, message);
  } catch (e: any) {
    console.error("ERROR: %s", e.message);
    return jsonResponse(500, e);
  }
};

async function postMessage(destinationTopic: string, message: string) {
  try {
    const MQTT_URL = process.env.MQTT_URL ?? "Undefined";
    const mqttClient = await mqtt.connectAsync(MQTT_URL);

    console.log("INFO: MQTT Connection open");

    await mqttClient.publishAsync(
      `zigbee2mqtt/${destinationTopic}/set`,
      message
    );

    console.log(
      "INFO: MQTT payload sent:  %s - %s",
      destinationTopic,
      JSON.stringify(message, null, 2)
    );

    await mqttClient.endAsync();

    console.log("INFO: MQTT Client disconnected");
  } catch (err) {
    console.error(err);
  }
}
