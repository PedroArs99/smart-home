import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MqttConfig } from './mqtt.config';

/** Loads environment configuration and exposes the typed config providers. */
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, cache: true })],
  providers: [MqttConfig],
  exports: [MqttConfig],
})
export class AppConfigModule {}
