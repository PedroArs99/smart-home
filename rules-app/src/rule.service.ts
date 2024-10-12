import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';

type RuleDefinition = {
  fromTopic: string;
  action: string;
  toTopic: string;
  payload: Record<string, any>;
};

@Injectable()
export class RuleService {
  private logger = new Logger(ConfigService.name);

  private rules: RuleDefinition[] = [
    {
      fromTopic: 'zigbee2mqtt/Wall_Switch',
      action: '1_single',
      toTopic: 'zigbee2mqtt/Room_Light/set',
      payload: {
        state: 'TOGGLE',
      },
    },
    {
      fromTopic: 'zigbee2mqtt/Wall_Switch',
      action: '2_single',
      toTopic: 'zigbee2mqtt/Desktop_Light/set',
      payload: {
        state: 'TOGGLE',
      },
    },
  ];

  constructor(@Inject('MQTT_SERVICE') private client: ClientProxy) {
    client.connect();
  }

  async publishEvent(topic: string, payload: Record<string, any>) {
    try {
      const triggeredRules = this.rules.filter(
        (rule) => rule.fromTopic === topic && rule.action === payload.action,
      );

      this.logger.log(
        `Found ${triggeredRules.length} rules to trigger for topic ${topic} with action payload: ${payload.action}`,
      );

      triggeredRules.forEach((rule) =>
        this.sendMqttMessage(rule.toTopic, rule.payload),
      );
    } catch (err) {
      this.logger.error(err);
    }
  }

  private async sendMqttMessage(topic: string, payload: Record<string, any>) {
    this.client.emit(topic, payload);

    this.logger.log(
      `Sent message to '${topic}': ${JSON.stringify(payload, null, 2)}`,
    );
  }
}
