/**
 * A single routing rule read from the rules file.
 *
 * When a device event arrives on [originTopic] whose `action` field equals
 * [originAction], [payload] is published to [destinationTopic].
 */
export interface Rule {
  originTopic: string;
  originAction: string;
  destinationTopic: string;
  /** Sent verbatim when a string, otherwise JSON-stringified before publishing. */
  payload: unknown;
}
