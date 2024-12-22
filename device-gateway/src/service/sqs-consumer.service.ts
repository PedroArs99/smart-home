import { Message } from '@aws-sdk/client-sqs';
import { Injectable, Logger } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { config } from 'src/config';
import { RuleService } from './rule.service';

type SqsDeviceMessage = {
  deviceName: string;
  payload: Record<string, any>;
};

@Injectable()
export class SqsConsumerService {
  private logger: Logger = new Logger(SqsConsumerService.name);

  constructor(private ruleService: RuleService) {}

  @SqsMessageHandler(config.SQS_QUEUE_NAME)
  public async handleMessage(message: Message) {
    const rawPayload = message.Body;
    const deviceMessage = JSON.parse(rawPayload) as SqsDeviceMessage;

    this.logger.log(`SQS message received: ${JSON.stringify(message)}`);
    this.ruleService.handleSqsEvent(
      deviceMessage.deviceName,
      deviceMessage.payload,
    );
  }
}
