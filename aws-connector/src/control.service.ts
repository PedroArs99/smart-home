import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type TriggerMessage = {
  originTopic: string;
  payload: Record<string, any>;
};

@Injectable()
export class ControlService {
  private logger = new Logger(ConfigService.name);

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async publishEvent(subject: string, payload: any, traceId?: string) {
    try {
      const controlURL = this.configService.getOrThrow('CONTROL_URL');
      const triggerMessage: TriggerMessage = {
        originTopic: subject,
        payload,
      }

      this.httpService.post(`${controlURL}/trigger`, triggerMessage).subscribe(response => {
        if (traceId)
        this.logger.debug(
          `Message with Trace ID ${traceId} sent with status code: ${response.status}`,
        );
      });
    } catch (err) {
      this.logger.error(err);
    }
  }
}
