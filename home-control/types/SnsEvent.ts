export type SnsEvent<T> = {
  Records: {
    Sns: {
      Subject: string;
      Message: T;
      Timestamp: Date;
      MessageAttributes: Map<string, any>;
    };
  };
};
