import { Module } from '@nestjs/common';
import { MqttController } from './controller/mqtt.controller';
import { RuleService } from './service/rule.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { SqsModule } from '@ssut/nestjs-sqs';
import { SqsConsumerService } from './service/sqs-consumer.service';
import { MqttProducerService } from './service/mqtt-producer.service';
import { StatusDbClientService } from './service/statusDb-client.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SqsModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const SQS_QUEUE_NAME = configService.getOrThrow('SQS_QUEUE_NAME');
        const SQS_QUEUE_URL = configService.getOrThrow('SQS_QUEUE_URL');

        return {
          consumers: [
            {
              name: SQS_QUEUE_NAME,
              queueUrl: SQS_QUEUE_URL,
              pollingWaitTimeMs: 500,
              waitTimeSeconds: 20,
            },
          ],
        };
      },
    }),
  ],
  controllers: [MqttController],
  providers: [
    {
      provide: 'MQTT_SERVICE',
      useFactory: (configService: ConfigService) => {
        const mqttURL = configService.getOrThrow('MQTT_URL');
        return ClientProxyFactory.create({
          transport: Transport.MQTT,
          options: {
            url: mqttURL,
            serializer: {
              serialize: (value) => value.data,
            },
          },
        });
      },
      inject: [ConfigService],
    },
    MqttProducerService,
    RuleService,
    SqsConsumerService,
    StatusDbClientService,
  ],
})
export class AppModule {}
