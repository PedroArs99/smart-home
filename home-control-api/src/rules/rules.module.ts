import { Module } from '@nestjs/common';
import { NoopRuleEngine } from './noop-rule-engine';
import { RuleEngine } from './rule-engine';

/** Binds the active [RuleEngine] implementation. Swap [NoopRuleEngine] here. */
@Module({
  providers: [{ provide: RuleEngine, useClass: NoopRuleEngine }],
  exports: [RuleEngine],
})
export class RulesModule {}
