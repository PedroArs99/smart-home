import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const logger = new Logger('NestApplication');

  const mqttUrl = configService.getOrThrow('MQTT_URL');
  app.connectMicroservice({
    transport: Transport.MQTT,
    options: {
      url: mqttUrl,
    },
  });

  app.startAllMicroservices();

  const serverPort = configService.get('SERVER_PORT') ?? 3000;
  await app.listen(serverPort, () => {
    logger.log(`Application started on port ${serverPort}`);
  });
}

bootstrap();
