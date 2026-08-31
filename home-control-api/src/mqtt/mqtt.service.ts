import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import mqtt, { MqttClient } from 'mqtt';
import { MqttConfig } from '../config/mqtt.config';
import { PublishOptions } from './publish-options';

/**
 * Outbound MQTT connection used to publish the commands produced by triggered
 * rules. Inbound events are handled by the microservice transport, not here.
 */
@Injectable()
export class MqttService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(MqttService.name);
  private client?: MqttClient;

  constructor(private readonly config: MqttConfig) {}

  /** Opens the broker connection used for publishing. */
  onModuleInit(): void {
    this.client = mqtt.connect(this.config.url, {
      username: this.config.username,
      password: this.config.password,
      clientId: `home-control-out-${Math.random().toString(16).slice(2, 8)}`,
      reconnectPeriod: 2000,
    });
    this.client.on('connect', () =>
      this.logger.log(`Connected to broker at ${this.config.url}`),
    );
    this.client.on('error', (err) => this.logger.error(`Broker error: ${err}`));
    this.client.on('reconnect', () => this.logger.warn('Reconnecting to broker'));
  }

  /** Publishes [payload] to [topic], the destination decided by the matched rule. */
  async publish(
    topic: string,
    payload: string,
    options: PublishOptions = {},
  ): Promise<void> {
    if (!this.client) throw new Error('MQTT client is not connected');
    if (!topic) throw new Error('Cannot publish without a destination topic');
    await this.client.publishAsync(topic, payload, {
      qos: this.config.qos,
      retain: options.retain ?? false,
    });
    this.logger.debug(`Published to '${topic}': ${payload}`);
  }

  /** Force-closes the broker connection on shutdown. */
  async onApplicationShutdown(): Promise<void> {
    await this.client?.endAsync(true);
  }
}
