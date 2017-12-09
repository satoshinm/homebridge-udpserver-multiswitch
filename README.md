# homebridge-udpserver-multiswitch
Simple UDP switches for Homebridge - stateful and radio-button/multi-switch switches

*Forked from homebridge-http-homebridge

## Switch Services

### Switch (standard on/off)
Meant to be used as a standard on/off switch. Light, projector, fan, etc.

```
{
        "accessory": "UdpServerMultiswitch",
        "name": "My Projector",
        "port": 8261,
        "on_payload": "[YOUR_UDP_ON_PAYLOAD]",
        "off_payload": "[YOUR_UDP_OFF_PAYLOAD]"
}
```

### Multiswitch (radio buttons)
Meant to be used as a switcher, where only one device is ever on.
Automaticaly set power state as off for the other devices.

```
{
    "accessory": "UdpServerMultiswitch",
    "name": "My Multiswitch",
    "port": 8261,
    "multiswitch": [
                { "name": "Apple TV Mode", "payload" : "43" },
                { "name": "PC Mode", "payload" : "42786sdf787" },
                { "name": "Android", "payload" : "l1479461871215" },
            ]
}
```

## Configuration Params

|             Parameter            |                       Description                       | Required |
| -------------------------------- | ------------------------------------------------------- |:--------:|
| `name`                           | name of the accessory                                   |          |
| `port`                           | 8261 (default)                                          |          |
| `on_payload` (only Switch)       | payload for the on state                                |     ✓    |
| `off_payload` (only Switch)      | payload for the off state                               |     ✓    |
| `multiswitch` (only Multiswitch) | list of inputs for the Multiswitch - order is respected |     ✓    |

## Help

  - Make sure specify a port in the if necessary. (i.e. `"port" : "8261"`)

## Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install homebridge-http using: `npm install -g homebridge-udpserver-multiswitch`
3. Update your config file
