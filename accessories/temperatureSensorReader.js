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


    function printResultFor(op) {
    return function printResult(err, res) {
        if (err) debug(op + ' error: ' + err.toString());
        if (res) debug(op + ' status: ' + res.constructor.name);
    };
    }

    sp.on('data',function(input) {
        debug('data:'+ input);
        try{
            var data = JSON.parse(input);
            if(data){
                data["timestamp"] = new Date().toISOString();    
                self.emit('event',data);      
            }
        }
        catch(err){
        
        }
    })
}
inherits(Reader, EventEmitter);
exports.reader = new Reader();
