import { Module } from '@nestjs/common';
import { MqttModule } from '../mqtt/mqtt.module';
import { RulesModule } from '../rules/rules.module';
import { TopicController } from './topic.controller';

/** Connects the MQTT transport to the rule engine. */
@Module({
  imports: [MqttModule, RulesModule],
  controllers: [TopicController],
})
export class MessagingModule {}
