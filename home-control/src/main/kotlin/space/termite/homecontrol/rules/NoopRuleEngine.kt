package space.termite.homecontrol.rules

import com.fasterxml.jackson.databind.JsonNode
import jakarta.enterprise.context.ApplicationScoped
import org.jboss.logging.Logger

/**
 * Placeholder [RuleEngine] that never triggers any action.
 *
 * TODO: replace this with a real implementation, e.g. one backed by a database table of
 * `(originTopic, action) -> (destinationTopic, payload)` rules (similar to the previous
 * `homeRules` DynamoDB table), a config file, or an in-memory map for simpler setups.
 */
@ApplicationScoped
class NoopRuleEngine : RuleEngine {

    private val logger = Logger.getLogger(NoopRuleEngine::class.java)

    override fun resolveActions(originTopic: String, payload: JsonNode?): List<TriggeredAction> {
        logger.debugf("No rule engine implementation configured yet; ignoring message from '%s'", originTopic)
        return emptyList()
    }
}
