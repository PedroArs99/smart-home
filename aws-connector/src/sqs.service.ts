import { SQSClient } from '@aws-sdk/client-sqs';
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Consumer } from 'sqs-consumer';
import { MqttService } from './mqtt.service';

type SqsMessage = {
  Body: string;
};

type Rule = {
  destinationTopic: string;
  rulePayload: string;
};

@Injectable()
export class SqsService implements OnModuleDestroy {
  private logger = new Logger(SqsService.name);
  private consumer: Consumer;

  constructor(private mqttService: MqttService) {
    this.logger.log('SQS Consumer starting...');
    this.consumer = Consumer.create({
      queueUrl:
        'https://sqs.eu-central-1.amazonaws.com/584871003262/HomeControlRuleQueue',
      handleMessage: async (message) => {
        this.forwardMessageToMqtt(message as SqsMessage);
      },
      sqs: new SQSClient({
        region: 'eu-central-1',
      }),
    });

    this.consumer.on('started', () => {
      this.logger.log('SQS Consumer started');
    });

    this.consumer.on('error', (error) => {
      this.logger.error(error);
    });

    this.consumer.start();
  }

  onModuleDestroy() {
    this.consumer.stop();
  }

  async forwardMessageToMqtt(message: SqsMessage) {
    const { destinationTopic, rulePayload } = JSON.parse(message.Body) as Rule;

    this.mqttService.sendMessage(destinationTopic, rulePayload);
  }
}
