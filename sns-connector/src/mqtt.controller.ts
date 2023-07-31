import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';

@Controller()
export class MqttController {
  private logger: Logger = new Logger(MqttController.name);

  @MessagePattern('zigbee2mqtt/+')
  logMqttEvents(@Payload() data: any, @Ctx() context: MqttContext) {
    const topic = context.getTopic();

    this.logger.log(`Event received from'${topic}: ${JSON.stringify(data)}'`);
  }
}
