import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { AppConfigModule } from './config/config.module';
import { MqttConfig } from './config/mqtt.config';

/**
 * Boots the app as a pure MQTT microservice: `@MessagePattern` handlers subscribe
 * to broker topics, and shutdown hooks close the connection on SIGINT/SIGTERM.
 */
async function bootstrap(): Promise<void> {
  const { url, username, password, qos } = await resolveMqttConfig();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.MQTT,
    options: {
      url,
      username,
      password,
      subscribeOptions: { qos },
    },
  });
  app.enableShutdownHooks();

  await app.listen();
  Logger.log(`Listening for MQTT device events on ${url}`, 'Bootstrap');
}

/** Snapshots MQTT settings via the config module before the transport is created. */
async function resolveMqttConfig() {
  const context = await NestFactory.createApplicationContext(AppConfigModule, {
    logger: false,
  });
  const config = context.get(MqttConfig);
  const snapshot = {
    url: config.url,
    username: config.username,
    password: config.password,
    qos: config.qos,
  };
  await context.close();
  return snapshot;
}

void bootstrap();
