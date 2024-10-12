import { Module } from '@nestjs/common';
import { MqttController } from './mqtt.controller';
import { RuleService } from './rule.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [MqttController],
  providers: [
    {
      provide: 'MQTT_SERVICE',
      useFactory: (configService: ConfigService) => {
        const mqttURL = configService.getOrThrow('MQTT_URL');
        return ClientProxyFactory.create({
          transport: Transport.MQTT,
          options: {
            url: mqttURL,
            serializer: {
              serialize: (value) => value.data,
            },
          },
        });
      },
      inject: [ConfigService],
    },
    RuleService,
  ],
})
export class AppModule {}
