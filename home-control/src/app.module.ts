import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { MessagingModule } from './messaging/messaging.module';

/** Application root: loads configuration and the messaging pipeline. */
@Module({
  imports: [AppConfigModule, MessagingModule],
})
export class AppModule {}
