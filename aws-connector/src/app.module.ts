import { Module } from '@nestjs/common';
import { MqttController } from './mqtt.controller';
import { SnsService } from './sns.service';
import { SqsService } from './sqs.service';
import { MqttService } from './mqtt.service';

@Module({
  imports: [],
  controllers: [MqttController],
  providers: [MqttService, SqsService, SnsService],
})
export class AppModule {}
