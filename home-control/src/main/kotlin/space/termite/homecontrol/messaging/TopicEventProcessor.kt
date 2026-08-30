package space.termite.homecontrol.messaging

import com.fasterxml.jackson.databind.ObjectMapper
import io.smallrye.mutiny.Multi
import io.smallrye.reactive.messaging.mqtt.ReceivingMqttMessageMetadata
import io.smallrye.reactive.messaging.mqtt.SendingMqttMessageMetadata
import jakarta.enterprise.context.ApplicationScoped
import org.eclipse.microprofile.reactive.messaging.Incoming
import org.eclipse.microprofile.reactive.messaging.Message
import org.eclipse.microprofile.reactive.messaging.Metadata
import org.eclipse.microprofile.reactive.messaging.Outgoing
import org.jboss.logging.Logger
import space.termite.homecontrol.rules.RuleEngine
import space.termite.homecontrol.rules.TriggeredAction

/**
 * Topic router: listens to device/sensor events on the `device-events` channel (see
 * `application.properties`) and, for every [TriggeredAction] resolved by the [RuleEngine],
 * publishes a message on the `device-commands` channel targeting the action's own destination
 * topic.
 *
 * One incoming message can therefore fan out into zero, one or many outgoing messages.
 */
@ApplicationScoped
class TopicEventProcessor(
    private val ruleEngine: RuleEngine,
    private val objectMapper: ObjectMapper,
) {

    private val logger = Logger.getLogger(TopicEventProcessor::class.java)

    @Incoming("device-events")
    @Outgoing("device-commands")
    fun onDeviceEvent(message: Message<ByteArray>): Multi<Message<ByteArray>> {
        val originTopic = message
            .getMetadata(ReceivingMqttMessageMetadata::class.java)
            .map { it.topic }
            .orElse("unknown")

        val payload = runCatching { objectMapper.readTree(message.payload) }
            .onFailure { logger.warnf(it, "Payload received on '%s' is not valid JSON", originTopic) }
            .getOrNull()

        logger.debugf("Received message on '%s': %s", originTopic, payload)

        val actions = ruleEngine.resolveActions(originTopic, payload)

        // NOTE: this is a simplified, fire-and-forget ack of the inbound MQTT message. It is
        // acknowledged as soon as it has been evaluated, independently of whether the resulting
        // outgoing message(s) are successfully published (those are ack'ed/nack'ed on their own
        // by the outgoing `device-commands` channel). Revisit if end-to-end delivery guarantees
        // are needed.
        message.ack()

        if (actions.isEmpty()) {
            return Multi.createFrom().empty()
        }

        return Multi.createFrom().iterable(actions.map(::toOutgoingMessage))
    }

    private fun toOutgoingMessage(action: TriggeredAction): Message<ByteArray> {
        val metadata = Metadata.of(
            SendingMqttMessageMetadata(action.destinationTopic, null, action.retain),
        )
        return Message.of(action.payload.toByteArray(), metadata)
    }
}
