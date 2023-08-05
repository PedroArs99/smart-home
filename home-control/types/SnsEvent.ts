export type SnsEvent = {
  Records: {
    Sns: {
      Subject: string;
      Message: string;
      Timestamp: Date;
      MessageAttributes: Map<string, any>;
    };
  }[];
};
