import { TriggeredAction } from './triggered-action';

/**
 * Extension point for deciding which actions to trigger for an incoming message.
 *
 * Declared as an abstract class so it can double as a DI injection token.
 */
export abstract class RuleEngine {
  /** Returns the actions to trigger for a message received on [originTopic]. */
  abstract resolveActions(
    originTopic: string,
    payload: unknown,
  ): Promise<TriggeredAction[]>;
}
