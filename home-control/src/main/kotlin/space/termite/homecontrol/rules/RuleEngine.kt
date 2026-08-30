package space.termite.homecontrol.rules

import com.fasterxml.jackson.databind.JsonNode

/**
 * Decides which, if any, [TriggeredAction]s should be executed in reaction to a message
 * received on [originTopic].
 *
 * This is the extension point meant to replace the old DynamoDB-backed rule lookup (see the
 * previous `aws-connector` / `home-control/api` services in the git history): given the topic a
 * message arrived on and its (best-effort parsed) JSON [payload], return the list of commands
 * that should be published as a consequence.
 */
interface RuleEngine {

    fun resolveActions(originTopic: String, payload: JsonNode?): List<TriggeredAction>
}
