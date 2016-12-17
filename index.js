'use strict';

var Service;
var Characteristic;
var udp = require('./udp');

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory('homebridge-udp-multiswitch', 'UdpMultiswitch', UdpMultiswitch);
};

function UdpMultiswitch(log, config) {
    this.log = log;

    this.name            = config.name || 'MultiSwitch';
    this.switchType      = config.switch_type;           
    this.host            = config.host;
    this.port            = config.port || 80;

    this.onPayload      = config.on_payload;
    this.offPayload     = config.off_payload;

    this.multiswitch     = config.multiswitch;

    switch (this.switchType) {
        case 'Switch':
            break;
        case 'Multiswitch':
            break;

        default:
            throw new Error('Unknown homebridge-udp-multiswitch switch type');
    }
}

UdpMultiswitch.prototype = {

    udpRequest: function(host, port, payload, callback) {
        udp(host, port, payload, function (err) {
            callback(err);
        });
    },

    setPowerState: function(targetService, powerState, callback, context) {
        var funcContext = 'fromSetPowerState';
        var payload;

        // Callback safety
        if (context == funcContext) {
            if (callback) {
                callback();
            }

            return;
        }

        switch(this.switchType) {
            case 'Switch':
                if (!this.onPayload || !this.offPayload) {
                    this.log.warn('Ignoring request; No power state payloads defined.');
                    callback(new Error('No power state payloads defined.'));
                    return;
                }

                payload  = powerState ? this.onPayload  : this.offPayload;
                break;

            case 'Multiswitch':
                this.services.forEach(function (switchService, idx) {
                    if (idx === 0) {
                        // Don't check the informationService which is at idx=0
                        return;
                    }

                    if (targetService.subtype === switchService.subtype) {
                        payload = this.multiswitch[idx-1].payload;
                        
                    } else {
                        switchService.getCharacteristic(Characteristic.On).setValue(false, undefined, funcContext);
                    }
                }.bind(this));
                break;

            default:
                this.log('Unknown homebridge-udp-multiswitch type in setPowerState');
        }

        this.udpRequest(this.host, this.port, payload, function(error) {
            if (error) {
                this.log.error('setPowerState failed: ' + error.message);
                this.log('response: ' + response + '\nbody: ' + responseBody);
            
                callback(error);
            } else {
                switch (this.switchType) {
                    case 'Switch':
                        this.log.info('==> ' + (powerState ? "On" : "Off"));
                        break;
                    case 'Multiswitch':
                        this.log('==> ' + targetService.subtype);
                        break;
                    default:
                        this.log.error('Unknown switchType in request callback');
                }

                callback();
            }
        }.bind(this));
    },

    identify: function (callback) {
        this.log('Identify me Senpai!');
        callback();
    },

    getServices: function () {
        this.services = [];

        var informationService = new Service.AccessoryInformation();
        informationService
            .setCharacteristic(Characteristic.Manufacturer, 'Udp-MultiSwitch')
            .setCharacteristic(Characteristic.Model, 'Udp-MultiSwitch');
        this.services.push(informationService);

        switch (this.switchType) {
            case 'Switch':
                this.log('(switch)');

                var switchService = new Service.Switch(this.name);
                switchService
                    .getCharacteristic(Characteristic.On)
                    .on('set', this.setPowerState.bind(this, switchService));

                this.services.push(switchService);

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

                    // Bind a copy of the setPowerState function that sets 'this' to the accessory and the first parameter
                    // to the particular service that it is being called for. 
                    var boundSetPowerState = this.setPowerState.bind(this, switchService);
                    switchService
                        .getCharacteristic(Characteristic.On)
                        .on('set', boundSetPowerState);

                    this.services.push(switchService);
                }

                break;
            default:
                this.log('Unknown homebridge-udp-multiswitch type in getServices');
        }
        
        return this.services;
    }
};