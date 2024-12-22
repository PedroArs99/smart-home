import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  SQS_QUEUE_NAME: process.env.SQS_QUEUE_NAME,
};
