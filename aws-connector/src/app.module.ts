import { Module } from '@nestjs/common';
import { MqttController } from './mqtt.controller';
import { ControlService } from './control.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    HttpModule,
  ],
  controllers: [MqttController],
  providers: [ControlService],
})
export class AppModule {}
