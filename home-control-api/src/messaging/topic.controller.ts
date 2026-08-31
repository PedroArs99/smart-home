import { Controller, Logger } from '@nestjs/common';
import { Ctx, MessagePattern, MqttContext, Payload } from '@nestjs/microservices';
import { MqttService } from '../mqtt/mqtt.service';
import { RuleEngine } from '../rules/rule-engine';

/** Topic filter subscribed to for incoming device/sensor events (e.g. zigbee2mqtt). */
export const DEVICE_EVENT_PATTERN = 'zigbee2mqtt/#';

/** Routes incoming device events to outgoing commands via the [RuleEngine]. */
@Controller()
export class TopicController {
  private readonly logger = new Logger(TopicController.name);

  constructor(
    private readonly mqtt: MqttService,
    private readonly ruleEngine: RuleEngine,
  ) {}

  /** Evaluates one incoming message and publishes a command per triggered action. */
  @MessagePattern(DEVICE_EVENT_PATTERN)
  async onDeviceEvent(
    @Payload() data: unknown,
    @Ctx() context: MqttContext,
  ): Promise<void> {
    const topic = context.getTopic();
    try {
      const payload = this.asJson(topic, data);
      this.logger.debug(`Received message on '${topic}': ${JSON.stringify(data)}`);

      const actions = await this.ruleEngine.resolveActions(topic, payload);
      for (const action of actions) {
        await this.mqtt.publish(action.destinationTopic, action.payload, {
          retain: action.retain,
        });
      }
    } catch (err) {
      this.logger.error(
        `Failed to handle message from '${topic}'`,
        err instanceof Error ? err.stack : String(err),
      );
    }
  }

  /** Returns [data] when it is a JSON object, otherwise warns and returns null. */
  private asJson(topic: string, data: unknown): unknown {
    if (data !== null && typeof data === 'object') {
      return data;
    }
    this.logger.warn(`Payload received on '${topic}' is not a JSON object`);
    return null;
  }
}
