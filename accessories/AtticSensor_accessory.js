var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;
var Reader = require('./temperatureSensorReader.js').reader;
var debug = require('debug')('AtticSensor');

var reader = Reader;
// here's a fake temperature sensor device that we'll expose to HomeKit
var FAKE_SENSOR = {
  currentTemperature: 50,
  currentHumidity:50,
  getCharacteristic:function(params) {
    return FAKE_SENSOR.currentHumidity;
  },
  getTemperature: function() { 
    console.log("Getting the current temperature!");
    return FAKE_SENSOR.currentTemperature;
  },
  setHumidity: function(temp) {
    // randomize temperature to a value between 0 and 100
    FAKE_SENSOR.currentHumidity = temp+ Math.random()*10;
    debug('currentHumidity:'+FAKE_SENSOR.currentHumidity);
  },
  setTemperature: function(temp) {
    // randomize temperature to a value between 0 and 100
    FAKE_SENSOR.currentTemperature = temp+ Math.round(Math.random() * 100);
    debug('currentTemperature:'+FAKE_SENSOR.currentTemperature);
  },randomizeTemperature: function() {
    // randomize temperature to a value between 0 and 100
    FAKE_SENSOR.currentTemperature = Math.round(Math.random() * 100);
  }
}


//console.log(reader);
// Generate a consistent UUID for our Temperature Sensor Accessory that will remain the same
// even when restarting our server. We use the `uuid.generate` helper function to create
// a deterministic UUID based on an arbitrary "namespace" and the string "temperature-sensor".
var sensorUUID = uuid.generate('hap-nodejs:accessories:temperature-sensor');

// This is the Accessory that we'll return to HAP-NodeJS that represents our fake lock.
var sensor = exports.accessory = new Accessory('atticSensor', sensorUUID);

// Add properties for publishing (in case we're using Core.js and not BridgedCore.js)
sensor.username = "C1:5D:3A:AE:5E:FA";
sensor.pincode = "031-45-154";

// Add the actual TemperatureSensor Service.
// We can see the complete list of Services and Characteristics in `lib/gen/HomeKitTypes.js`
sensor
  .addService(Service.TemperatureSensor)
  .getCharacteristic(Characteristic.CurrentTemperature)
  .on('get', function(callback) {
    
    // return our current value
    callback(null, FAKE_SENSOR.getTemperature());
  });
  sensor.addService(Service.HumiditySensor)
  .getCharacteristic(Characteristic.CurrentRelativeHumidity)
  .on('get',function(callback) {
    callback(null,FAKE_SENSOR.getCurrentHumidity);
  });

reader.on('event',function(data){
   debug(data);
   if(data.deviceId === 'attic'){
     FAKE_SENSOR.setTemperature(data.temperature);
     FAKE_SENSOR.setHumidity(data.humidity);
     sensor
      .getService(Service.TemperatureSensor)
      .setCharacteristic(Characteristic.CurrentTemperature, FAKE_SENSOR.currentTemperature);
     FAKE_SENSOR.setTemperature(data.humidity);
     sensor
      .getService(Service.HumiditySensor)
      .setCharacteristic(Characteristic.CurrentRelativeHumidity, FAKE_SENSOR.currentHumidity);
   }
});

