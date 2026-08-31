import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MqttConfig } from './mqtt.config';

/**
 * Loads environment configuration and exposes the typed config providers.
 *
 * Kept separate from the messaging stack so `main.ts` can resolve settings
 * without booting the MQTT connection.
 */
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, cache: true })],
  providers: [MqttConfig],
  exports: [MqttConfig],
})
export class AppConfigModule {}
