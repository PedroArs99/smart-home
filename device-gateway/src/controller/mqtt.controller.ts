import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { RuleService } from '../service/rule.service';

@Controller()
export class MqttController {
  private logger: Logger = new Logger(MqttController.name);

  constructor(private controlService: RuleService) {}

  @MessagePattern('zigbee2mqtt/+')
  logMqttEvents(
    @Payload() data: Record<string, any>,
    @Ctx() context: MqttContext,
  ) {
    const topic = context.getTopic();

    this.logger.log(
      `MQTT message received from'${topic}: ${JSON.stringify(data)}'`,
    );

    this.controlService.handleMqttEvent(topic, data);
  }
}
