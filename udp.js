module.exports = function (host, port, payload, callback) {
  var broadcast = '000000000000000009000000e00729070b00170a00000000c0a80a0555c100008ec20000000006000000000000000000'
  var dgram = require('dgram');
  
  if (typeof payload === 'object') {
        sendMultiPackets(payload);
  }
  else {
       sendPackets(payload);
  };
  
  function sendPackets(payloadMessage){
        var client = dgram.createSocket('udp4');
        var delayTime = Math.floor(Math.random() * 1500) + 1;
        var message = new Buffer(payloadMessage, 'hex');
        setTimeout(function() { 
          client.send(broadcast, 0, broadcast.length, port, host, function(err, bytes) {
            if (err) throw err;
            console.log('UDP message sent to ' + host +':'+ port);

            client.send(message, 0, message.length, port, host, function(err, bytes) {
              if (err) throw err;
              console.log('UDP message sent to ' + host +':'+ port);
              client.close();
              
              callback(err);
            });
            
          });
        }, delayTime);
    }
  
    function sendMultiPackets(payloadMessage){
        var client = dgram.createSocket('udp4');
        var delayTime = Math.floor(Math.random() * 200) + 1;
        var message = new Buffer(payloadMessage[0], 'hex');
        var message2 = new Buffer(payloadMessage[1], 'hex');
        setTimeout(function() { 
          client.send(message, 0, message.length, port, host, function(err, bytes) {
            if (err) throw err;
            callback(err);
            console.log('UDP message sent to ' + host +':'+ port);
            setTimeout(function() {
              client.send(message2, 0, message2.length, port, host, function(err, bytes) {
                if (err) throw err;
                console.log('UDP message2 sent to ' + host +':'+ port);
                client.close();
                
              });
            }, 1500);
          });
        }, delayTime);
    }
}
