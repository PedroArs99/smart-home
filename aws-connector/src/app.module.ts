import { Module } from '@nestjs/common';
import { MqttController } from './mqtt.controller';
import { SnsService } from './sns.service';
import { SqsService } from './sqs.service';
import { MqttService } from './mqtt.service';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    })
  ],
  controllers: [MqttController],
  providers: [MqttService, SqsService, SnsService],
})
export class AppModule {}
