/**
 * An action to execute after a rule match: publish [payload] to [destinationTopic].
 *
 * The rule that matched the origin topic chooses [destinationTopic]; a single event
 * may fan out to several actions on different topics (e.g. `zigbee2mqtt/switch` in,
 * `zigbee2mqtt/plug` out).
 */
export interface TriggeredAction {
  destinationTopic: string;
  payload: string;
  retain?: boolean;
}
