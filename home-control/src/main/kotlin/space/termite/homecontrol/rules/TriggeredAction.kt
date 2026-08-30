package space.termite.homecontrol.rules

/**
 * A concrete action to execute as a consequence of a rule match: publish [payload] to
 * [destinationTopic] on the MQTT broker.
 */
data class TriggeredAction(
    val destinationTopic: String,
    val payload: String,
    val retain: Boolean = false,
)
