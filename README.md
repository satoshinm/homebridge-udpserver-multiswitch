# homebridge-udpserver-multiswitch
Simple UDP server switches for Homebridge - stateful and radio-button/multi-switch switches

*Forked from [homebridge-udp-multiswitch](https://github.com/nitaybz/homebridge-udp-multiswitch)

Listens on a UDP port, and alters state based on the UDP packet payload. Developed for use
with an ESP8266 device running [wallswitch](https://github.com/satoshinm/wallswitch) to
smarten up your dumb light switch.

## Switch Services

### Switch (standard on/off)
Meant to be used as a standard on/off switch. Wall switch, etc.

```
{
        "accessory": "UdpServerMultiswitch",
        "name": "Wallswitch",
        "port": 8261,
        "on_payload": "ff",
        "off_payload": "00",
        "toggle_payload": "80"
}
```

### Multiswitch (radio buttons)
Can be used as a switcher, where only one device is ever on. However,
the `on_payload`, `off_payload`, and `toggle_payload` options can also be
optionally specified to affect all of the states.

Automatically set power state as off for the other devices.

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

|             Parameter            |                       Description                       |
| -------------------------------- | ------------------------------------------------------- |
| `name`                           | name of the accessory                                   |
| `port`                           | 8261 (default)                                          |
| `on_payload`                     | payload for turning all to the on state                 |
| `off_payload`                    | payload for turning all to the off state                |
| `toggle_payload`                 | payload for toggling all                                |
| `multiswitch`                    | list of inputs for the Multiswitch - order is respected |

## Help

Test sending inputs to the UDP port using `nc -u 127.0.0.1 8261`.

## Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install homebridge-http using: `npm install -g homebridge-udpserver-multiswitch`
3. Update your config file
