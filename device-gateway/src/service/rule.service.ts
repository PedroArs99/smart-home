import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MqttProducerService } from './mqtt-producer.service';

type AlexaDeviceMapping = {
  originDevice: string;
  toTopic: string;
};

type RuleDefinition = {
  fromTopic: string;
  action: string;
  toTopic: string;
  payload: Record<string, any>;
};

@Injectable()
export class RuleService {
  private logger = new Logger(RuleService.name);

  private alexaDeviceMappings: AlexaDeviceMapping[] = [
    {
      originDevice: 'Desktop_Light',
      toTopic: 'zigbee2mqtt/Desktop_Light/set',
    },
  ];

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

  constructor(private mqttProducerService: MqttProducerService) {}

  async handleMqttEvent(topic: string, payload: Record<string, any>) {
    try {
      const triggeredRules = this.rules.filter(
        (rule) => rule.fromTopic === topic && rule.action === payload.action,
      );

      this.logger.log(
        `Found ${triggeredRules.length} rules to trigger for topic ${topic} with action payload: ${payload.action}`,
      );

      triggeredRules.forEach((rule) =>
        this.mqttProducerService.sendMqttMessage(rule.toTopic, rule.payload),
      );
    } catch (err) {
      this.logger.error(err);
    }
  }

  async handleSqsEvent(device: string, payload: Record<string, any>) {
    const deviceMapping = this.alexaDeviceMappings.find(
      (mapping) => mapping.originDevice === device,
    );

    if (deviceMapping) {
      this.logger.log(
        `Found Alexa Device mapping for ${device}. Forwarding payload: ${JSON.stringify(
          payload,
        )} to ${deviceMapping.toTopic}.`,
      );

      this.mqttProducerService.sendMqttMessage(deviceMapping.toTopic, payload);
    }
  }
}