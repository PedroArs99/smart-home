import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StatusDbClientService {
  private logger = new Logger(StatusDbClientService.name);

  private region = this.configService.getOrThrow('AWS_REGION');
  private tableName = this.configService.getOrThrow(
    'DYNAMODB_STATUS_TABLE_NAME',
  );
  private dynamoDbClient = new DynamoDBClient({
    region: this.region,
  });

  constructor(private configService: ConfigService) {}

  async writeDeviceStatus(deviceName: string, status: Record<string, any>) {
    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: marshall({
        deviceName,
        status,
      }),
    });

    const result = await this.dynamoDbClient.send(command);

    if (result.$metadata.httpStatusCode === 200) {
      this.logger.log(
        `Status for '${deviceName}' saved successfully - Payload: ${JSON.stringify(
          status,
        )}`,
      );
    } else {
      this.logger.error(
        `Error while saving status for '${deviceName}' - Payload: ${JSON.stringify(
          status,
        )}`,
      );
    }
  }
}
