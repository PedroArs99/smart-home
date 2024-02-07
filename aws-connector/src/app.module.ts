import { Module } from '@nestjs/common';
import { MqttController } from './mqtt.controller';
import { SnsService } from './sns.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    })
  ],
  controllers: [MqttController],
  providers: [SnsService],
})
export class AppModule {}
