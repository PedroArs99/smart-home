# Agent instructions

- Do not start any MQTT broker in the background (e.g. via `brew services start mosquitto`,
  `mosquitto` daemon, docker, etc.) as part of any task.
- Never look up the git history for past status of the repo unless specified by the user.
- Write JSDoc for all methods. Keep it simple and straightforward to read; reduce verbosity.
- The user tends to manually edit files mid-session. Always check for changes before further writing.
- Do not write any kind of automated test unless the user asks explicitly for it.
