import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SnsService {
  private logger = new Logger(SnsService.name);
  private snsClient = new SNSClient({ region: 'eu-central-1' });

  async publishEvent(subject: string, data: any, traceId?: string) {
    try {
      const command = new PublishCommand({
        Message: JSON.stringify(data),
        Subject: subject,
        TopicArn: 'arn:aws:sns:eu-central-1:584871003262:HomeEvent',
      });
      const response = await this.snsClient.send(command);
      if (traceId)
        this.logger.log(
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
