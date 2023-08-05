import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { SnsService } from './sns.service';

@Controller()
export class MqttController {
  private logger: Logger = new Logger(MqttController.name);

  constructor(private snsService: SnsService){}

  @MessagePattern('zigbee2mqtt/+')
  logMqttEvents(@Payload() data: any, @Ctx() context: MqttContext) {
    const topic = context.getTopic();
    const traceId = uuidv4()

    this.logger.log(`MQTT message received from'${topic}: ${JSON.stringify(data)}' - Trace ID: ${traceId}`);

    this.snsService.publishEvent(topic, data, traceId);
  }
}
