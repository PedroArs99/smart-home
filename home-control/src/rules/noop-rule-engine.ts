import { Injectable, Logger } from '@nestjs/common';
import { RuleEngine } from './rule-engine';
import { TriggeredAction } from './triggered-action';

/**
 * [RuleEngine] with no rules configured yet.
 *
 * TODO: replace with a real implementation backed by a database, config file, etc.
 */
@Injectable()
export class NoopRuleEngine extends RuleEngine {
  private readonly logger = new Logger(NoopRuleEngine.name);

  /** Always resolves to an empty list. */
  async resolveActions(originTopic: string): Promise<TriggeredAction[]> {
    this.logger.debug(
      `No rule engine configured yet; ignoring message from '${originTopic}'`,
    );
    return [];
  }
}
