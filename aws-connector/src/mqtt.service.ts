import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService implements OnModuleDestroy {
  private logger = new Logger(MqttService.name);
  private mqttClient: mqtt.MqttClient;

  constructor(configService: ConfigService) {
    const mqttUrl = configService.get("MQTT_URL");
    this.mqttClient = mqtt.connect(mqttUrl);

    this.mqttClient.on('connect', () => {
      this.logger.log("MQTT Client connected");
    })
  }

  sendMessage(topic: string, payload: any) {
    this.mqttClient.publish(topic, payload);
  }

  onModuleDestroy() {
    this.mqttClient.end();
  }
}
