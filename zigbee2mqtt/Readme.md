# Zigbee2Mqtt

Zigbee-to-MQTT bridge deployed on the cluster. Everything lives in the `smart-home` namespace, deployed from the manifests in `k8s/`. It pairs Zigbee devices through the Sonoff Zigbee 3.0 USB dongle and publishes them to the Mosquitto broker.

## Deploy

```sh
kubectl apply -f k8s/
```

## Hardware

The dongle is passed through from the node by its stable `/dev/serial/by-id/` path:

```
/dev/serial/by-id/usb-ITead_Sonoff_Zigbee_3.0_USB_Dongle_Plus_fac04edee75fec118ef3395f25bfaa52-if00-port0
```

It is mounted into the container as `/dev/zigbee` (a `CharDevice` `hostPath` volume) and the container runs `privileged` so it can access the USB serial device. The config's `serial.port` points at `/dev/zigbee`.

`/run/udev` is mounted read-only so the adapter firmware/details resolve correctly.

## Configuration

* The initial bridge config (`configuration.yaml`) lives in the `zigbee2mqtt-config` ConfigMap. An init container copies it to the PVC at `/app/data/configuration.yaml` on first deployment, so Zigbee2MQTT can update the file. After changing the ConfigMap, remove the existing file from the PVC or update it manually before restarting:

  ```sh
  kubectl -n smart-home rollout restart deployment/zigbee2mqtt
  ```

  Zigbee2mqtt also writes runtime data (paired devices, network state) back to the PVC.

* The MQTT broker is reached via the in-cluster DNS name:

  ```
  mqtt://mosquitto.smart-home.svc.cluster.local:1883
  ```

  Anonymous access is enabled on the broker, so no credentials are needed.

* Persistence uses a 1Gi PVC (`microk8s-hostpath` storage), so paired devices and network state survive pod restarts.

## Web UI (frontend)

The built-in frontend is enabled on port `8080`. To reach it from your local machine:

```sh
kubectl -n smart-home port-forward svc/zigbee2mqtt 8080:8080
```

Then open http://localhost:8080.

## Pairing devices

`permit_join` is `false` by default. Enable pairing from the web UI (the "Permit join" toggle) or set `permit_join: true` in the ConfigMap and restart.

## Security notes

* The frontend has no authentication enabled — only expose it via port-forward or put it behind an authenticating ingress before exposing it more broadly.
* The container runs `privileged` to access the USB device, which is required for the serial passthrough on this single-node cluster.
