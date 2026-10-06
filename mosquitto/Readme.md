# Mosquitto

MQTT broker deployed on the cluster. Everything lives in the `smart-home` namespace, deployed from the manifests in `k8s/`.

## Connecting

### From within the cluster

Use the service DNS name:

```
mosquitto.smart-home.svc.cluster.local:1883
```

Anonymous access is enabled, so no credentials are required.

```sh
# From another pod within the cluster
mosquitto_pub -h mosquitto.smart-home.svc.cluster.local -t my/topic -m "hello"
mosquitto_sub -h mosquitto.smart-home.svc.cluster.local -t my/topic
```

If the connecting pod is in the `smart-home` namespace, the short name `mosquitto` also resolves.

### From your local machine (port-forward)

```sh
kubectl -n smart-home port-forward svc/mosquitto 1883:1883
```

Then connect to `localhost:1883`:

```sh
mosquitto_pub -h localhost -t my/topic -m "hello"
mosquitto_sub -h localhost -t my/topic
```

## Configuration

* The broker config (`mosquitto.conf`) lives in the `mosquitto-config` ConfigMap. After changing it, restart the pod for it to take effect:

  ```sh
  kubectl -n smart-home rollout restart deployment/mosquitto
  ```

* Persistence is enabled with a 1Gi PVC (`microk8s-hostpath` storage), so retained messages and durable subscriptions survive pod restarts.

## Security notes

Anonymous access is acceptable for network-scoped usage (only pods inside the cluster can reach the Service). If the broker ever gets exposed via ingress, add authentication first — e.g. a `password_file` mounted from a Secret and `allow_anonymous false`.
