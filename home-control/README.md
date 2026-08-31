# home-control

MQTT rule router for a smart home, built with [NestJS](https://nestjs.com/).

It subscribes to device/sensor events (e.g. from zigbee2mqtt), asks a `RuleEngine`
which actions those events trigger, and publishes the resulting commands back to
the broker.

## Architecture

The app runs as a [NestJS MQTT microservice](https://docs.nestjs.com/microservices/mqtt).
Inbound events arrive through a `@MessagePattern` handler; commands go out through a
dedicated publishing connection.

```
MQTT topic (zigbee2mqtt/#)
        │  @MessagePattern
        ▼
  TopicController  ──▶  RuleEngine.resolveActions(topic, payload)
        │                        │
        │                        ▼
        └──▶  MqttService.publish(destinationTopic, payload)  ──▶  MQTT
```

| Piece | Responsibility |
| --- | --- |
| `main.ts` | Bootstraps the MQTT transport (`Transport.MQTT`) using settings from the config module |
| `TopicController` | `@MessagePattern('zigbee2mqtt/#')` — parse each event, run the rule engine, publish every triggered action |
| `MqttService` | Outbound broker connection; `publish(topic, payload, { retain })` |
| `RuleEngine` | Abstract token; decides actions for a `(topic, payload)` pair |
| `NoopRuleEngine` | Default binding — resolves to no actions. Swap in `RulesModule`. |

Each matched rule chooses its own destination topic, so one event can fan out to
several actions on different topics — e.g. an event on `zigbee2mqtt/switch`
publishing to `zigbee2mqtt/plug`.

The subscribed topic filter is the `DEVICE_EVENT_PATTERN` constant in
`topic.controller.ts` (a `@MessagePattern` argument, so it cannot be an env var).
`+` and `#` wildcards are supported; `MqttContext.getTopic()` yields the concrete topic.

## Running

```bash
npm install
cp .env.example .env   # adjust for your broker
npm run start:dev
```

The service has no HTTP surface — it is a pure microservice driven by MQTT.

## Configuration

MQTT settings come from the environment via `@nestjs/config` (see `.env.example`):

| Variable | Default | Purpose |
| --- | --- | --- |
| `MQTT_HOST` / `MQTT_PORT` | `localhost` / `1883` | Broker address |
| `MQTT_USERNAME` / `MQTT_PASSWORD` | – | Broker credentials (optional) |
| `MQTT_QOS` | `1` | QoS for the subscription and published commands |

Destination topics are not configured here — they come from each `TriggeredAction`
the rule engine returns.
