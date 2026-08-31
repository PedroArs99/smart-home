import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [
    AppConfigModule,
    MessagingModule
  ],
})
export class AppModule {}
