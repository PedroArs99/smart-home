import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { MqttConfig } from './config/mqtt.config';

/**
 * Boots a single app context, reads MQTT settings from it, then attaches the
 * MQTT transport to that same context. No HTTP port is opened.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: false });
  const { url, username, password, qos } = app.get(MqttConfig);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: { url, username, password, subscribeOptions: { qos } },
  });
  app.enableShutdownHooks();

  await app.startAllMicroservices();
  await app.init();
  Logger.log(`Listening for MQTT device events on ${url}`, 'Bootstrap');
}

bootstrap();
