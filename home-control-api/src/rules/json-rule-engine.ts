import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Rule } from './rule';
import { RuleEngine } from './rule-engine';
import { TriggeredAction } from './triggered-action';

import rules from '../../rules.json'

/**
 * [RuleEngine] backed by a JSON array of [Rule]s, loaded once at startup.
 *
 * A message matches a rule when it arrives on the rule's `originTopic` and its
 * payload's `action` field equals the rule's `originAction`.
 */
@Injectable()
export class JsonRuleEngine extends RuleEngine {
  private readonly logger = new Logger(JsonRuleEngine.name);

  constructor() {
    super();
  }

  /** Returns a publish action for every rule matching [originTopic] and the message action. */
  async resolveActions(
    originTopic: string,
    payload: unknown,
  ): Promise<TriggeredAction[]> {
    const action = this.readAction(payload);
    if (action === undefined) return [];
    return rules
      .filter(
        (rule) =>
          rule.originTopic === originTopic && rule.originAction === action,
      )
      .map((rule) => ({
        destinationTopic: rule.destinationTopic,
        payload: JSON.stringify(rule.payload),
      }));
  }

  /** Extracts the `action` string from a device-event payload, if present. */
  private readAction(payload: unknown): string | undefined {
    if (payload !== null && typeof payload === 'object') {
      const action = (payload as Record<string, unknown>).action;
      if (typeof action === 'string') return action;
    }
    return undefined;
  }
}
