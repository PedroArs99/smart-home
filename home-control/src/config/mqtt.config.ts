import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Strongly-typed MQTT settings. Every value is read through {@link ConfigService},
 * never `process.env` directly, with development-friendly defaults.
 */
@Injectable()
export class MqttConfig {
  constructor(private readonly config: ConfigService) {}

  /** Broker hostname. */
  get host(): string {
    return this.config.get<string>('MQTT_HOST', 'localhost');
  }

  /** Broker port. */
  get port(): number {
    return Number(this.config.get('MQTT_PORT', 1883));
  }

  /** Broker username, or undefined when unauthenticated. */
  get username(): string | undefined {
    return this.config.get<string>('MQTT_USERNAME') || undefined;
  }

  /** Broker password, or undefined when unauthenticated. */
  get password(): string | undefined {
    return this.config.get<string>('MQTT_PASSWORD') || undefined;
  }

  /** Broker connection URL, assembled from host and port. */
  get url(): string {
    return `mqtt://${this.host}:${this.port}`;
  }

  /** QoS applied to the subscription and to published commands. */
  get qos(): 0 | 1 | 2 {
    const qos = Number(this.config.get('MQTT_QOS', 1));
    return qos === 0 || qos === 2 ? qos : 1;
  }
}
