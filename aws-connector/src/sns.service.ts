import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SnsService {
  private logger = new Logger(SnsService.name);
  private snsClient = new SNSClient({ region: 'eu-central-1' });

  constructor(private configService: ConfigService){}

  async publishEvent(subject: string, data: any, traceId?: string) {
    try {
      const command = new PublishCommand({
        Message: JSON.stringify(data),
        Subject: subject,
        TopicArn: this.configService.getOrThrow('SNS_TOPIC_ARN'),
      });
      const response = await this.snsClient.send(command);
      if (traceId)
        this.logger.debug(
          `Message with Trace ID ${traceId} send. \n ${JSON.stringify(
            response,
            null,
            2,
          )}`,
        );
    } catch (err) {
      this.logger.error(err);
    }
  }
}
