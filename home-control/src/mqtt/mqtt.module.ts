import { Module } from '@nestjs/common';
import { MqttConfig } from '../config/mqtt.config';
import { MqttService } from './mqtt.service';

/** Provides the shared [MqttService] connection to the rest of the app. */
@Module({
  providers: [MqttConfig, MqttService],
  exports: [MqttService],
})
export class MqttModule {}
