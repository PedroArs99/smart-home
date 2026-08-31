/** Options accepted when publishing a command. */
export interface PublishOptions {
  /** Ask the broker to retain this message as the topic's last known value. */
  retain?: boolean;
}
