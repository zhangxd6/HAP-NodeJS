'use strict'

var serialport = require('serialport');
var portName = process.env.SENSOR_PORT_NAME ||'/dev/cu.usbmodem1411';
var debug = require('debug')('SensorReader');

var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
function Reader(){
    var self = this;
    var sp = new serialport.SerialPort(portName,{
        baudRate: 9600,
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        flowControl: false,
        parser: serialport.parsers.readline("\n")
    });

    var clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
    var Message = require('azure-iot-device').Message;

    var connectionString = process.env.ATTIC_CONNECTIONSTRING;
    var connectionString2 = process.env.GARAGE_CONNECTIONSTRING;

    var clients = {
        garage:clientFromConnectionString(connectionString2),
        attic:clientFromConnectionString(connectionString)
    };


    function printResultFor(op) {
    return function printResult(err, res) {
        if (err) debug(op + ' error: ' + err.toString());
        if (res) debug(op + ' status: ' + res.constructor.name);
    };
    }

    // sp.on('data',function(input) {
    //     debug('data:'+ input);
    //     try{
    //         var data = JSON.parse(input);
    //         if(data){
    //             data["timestamp"] = new Date().toISOString();    
    //             self.emit('event',data);      
    //         }
    //     }
    //     catch(err){
        
    //     }
    //})

    var connectCallback = function (err,c) {
    if (err) {
        debug('Could not connect: ' + err);
    } else {
        debug('Client connected');

        // Create a message and send it to the IoT Hub every second
        sp.on('data', function(input) {
        //console.log(input);
        try{
            var data = JSON.parse(input);
            if(data){
                if(c===data.deviceId &&clients[data.deviceId]){
                    data["timestamp"] = new Date().toISOString();
                    self.emit('event',data);  
                    //console.log(data);
                    var message = new Message(JSON.stringify(data));
                    console.log("Sending message: " + message.getData());
                    clients[data.deviceId].sendEvent(message, printResultFor('send'));
               }
            }
        }
        catch(err){
        
        }
        });
    }
    };

    clients['garage'].open(function(err) {
        connectCallback(err,'garage');
    });
    clients['attic'].open(function(err) {
        connectCallback(err,'attic');
    });
}




inherits(Reader, EventEmitter);
exports.reader = new Reader();
