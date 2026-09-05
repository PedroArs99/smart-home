import { Module } from '@nestjs/common';
import { JsonRuleEngine } from './json-rule-engine';
import { RuleEngine } from './rule-engine';

/** Binds the active [RuleEngine] implementation. Swap [JsonRuleEngine] here. */
@Module({
  providers: [{ provide: RuleEngine, useClass: JsonRuleEngine }],
  exports: [RuleEngine],
})
export class RulesModule { }
