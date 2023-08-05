import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService implements OnModuleDestroy {
  private logger = new Logger(MqttService.name);
  private mqttClient = mqtt.connect('mqtt://raspberrypi.local:1883');

  constructor() {
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
