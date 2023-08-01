import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import {
  SNSClient,
  AddPermissionCommand,
  PublishCommand,
} from '@aws-sdk/client-sns';

@Controller()
export class MqttController {
  private logger: Logger = new Logger(MqttController.name);
  private snsClient = new SNSClient({ region: 'eu-central-1' });

  @MessagePattern('zigbee2mqtt/+')
  logMqttEvents(@Payload() data: any, @Ctx() context: MqttContext) {
    const topic = context.getTopic();

    this.logger.log(`Event received from'${topic}: ${JSON.stringify(data)}'`);

    this.publishSnsEvent(topic, data);
  }

  private async publishSnsEvent(subject: string, data: any) {
    try {
      const command = new PublishCommand({
        Message: JSON.stringify(data),
        Subject: subject,
        TopicArn: 'arn:aws:sns:eu-central-1:584871003262:HomeEvent',
      });
      await this.snsClient.send(command);
    } catch (err) {
      this.logger.error(err);
    }
  }
}
