import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MqttProducerService {
  private logger: Logger = new Logger(MqttProducerService.name);

  constructor(@Inject('MQTT_SERVICE') private client: ClientProxy) {
    client.connect();
  }

  public async sendMqttMessage(topic: string, payload: Record<string, any>) {
    this.client.emit(topic, payload);

    this.logger.log(
      `Sent message to '${topic}': ${JSON.stringify(payload, null, 2)}`,
    );
  }
}
