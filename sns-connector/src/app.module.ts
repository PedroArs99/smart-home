import { Module } from '@nestjs/common';
import { MqttController } from './mqtt.controller';

@Module({
  imports: [],
  controllers: [MqttController],
  providers: [],
})
export class AppModule {}
