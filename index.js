'use strict';

var Service;
var Characteristic;
var dgram = require('dgram');

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory('homebridge-udp-multiswitch', 'UdpMultiswitch', UdpMultiswitch);
};

function UdpMultiswitch(log, config) {
    this.log = log;

    this.name            = config.name || 'MultiSwitch';
    this.switchType      = config.switch_type;           
    this.port            = config.port || 8261;

    var onPayload        = config.on_payload;
    var offPayload       = config.off_payload;

    var multiswitch      = config.multiswitch;

    switch (this.switchType) {
        case 'Switch':
            break;
        case 'Multiswitch':
            break;

        default:
            throw new Error('Unknown homebridge-udp-multiswitch switch type');
    }

    var services = [];

    var informationService = new Service.AccessoryInformation();
    informationService
        .setCharacteristic(Characteristic.Manufacturer, 'Udp-MultiSwitch')
        .setCharacteristic(Characteristic.Model, 'Udp-MultiSwitch');
    services.push(informationService);

    switch (this.switchType) {
        case 'Switch':
            this.log('(switch)');

            var switchService = new Service.Switch(this.name);
            switchService
                .getCharacteristic(Characteristic.On)
                .setValue(false);

            services.push(switchService);

            break;
        case 'Multiswitch':
            this.log('(multiswitch)');

            for (var i = 0; i < this.multiswitch.length; i++) {
                var switchName = this.multiswitch[i].name;

                switch(i) {
                    case 0:
                        this.log.warn('---+--- ' + switchName); break;
                    case this.multiswitch.length-1:
                        this.log.warn('   +--- ' + switchName); break;
                    default:
                        this.log.warn('   |--- ' + switchName);
                }

                var switchService = new Service.Switch(switchName, switchName);

                switchService
                    .getCharacteristic(Characteristic.On)
                    .setValue(false);

                services.push(switchService);
            }

            break;
        default:
            this.log('Unknown homebridge-udp-multiswitch type in getServices');
    }
    

    this.server = dgram.createSocket('udp4');
    this.server.on('error', function(err) {
        console.log('udp server error');
        console.log(err);
        server.close();
    });

    function setAll(value) {
       for (var i = 1; i < services.length; ++i) {
         services[i]
             .getCharacteristic(Characteristic.On)
             .setValue(value);
       }
    }

    this.server.on('message', function(msg, rinfo) {
        var hex = msg.toString('hex');

        console.log('udp message received: ' + hex + ' from ' + rinfo.address);
console.log('onPayload='+onPayload);
console.log('offPayload='+offPayload);
console.log(config);
        if (hex === onPayload) {
            console.log('requested to turn on');
            setAll(true);
        } else if (hex === offPayload) {
            console.log('requested to turn off');
            setAll(false);
        } else if (multiswitch) {
            var found = false;
            for (var i = 0; i < multiswitch.length; ++i) {
                var name = multiswitch[i].name;
                var payload = multiswitch[i].name;

                if (hex === payload) {
                    found = name;
                }
            }

            if (found) {
                console.log('requested to turn on only ' + found);
                for (var i = 1; i < services.length; ++i) {
                    services[i]
                        .getCharacteristic(Characteristic.On)
                        .setValue(service[i].displayName === found);
                }
            } else {
                console.log('unrecognized multiswitch message received: ' + hex);
            }
        } else {
            console.log('unrecognized message received: ' + hex);
        }
    });

    this.services = services;

    this.server.bind(this.port);
    console.log('homebridge-udp-multiswitch listening udp port ' + this.port);
}

UdpMultiswitch.prototype = {

    getServices: function () {
        return this.services;
    },
};
