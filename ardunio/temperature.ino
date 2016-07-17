// Example testing sketch for various DHT humidity/temperature sensors
// Written by ladyada, public domain

#include "DHT.h"

#define DHTPIN 5     // what digital pin we're connected to

// Uncomment whatever type you're using!
#define DHTTYPE DHT11   // DHT 11
//#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321
//#define DHTTYPE DHT21   // DHT 21 (AM2301)

// Connect pin 1 (on the left) of the sensor to +5V
// NOTE: If using a board with 3.3V logic like an Arduino Due connect pin 1
// to 3.3V instead of 5V!
// Connect pin 2 of the sensor to whatever your DHTPIN is
// Connect pin 4 (on the right) of the sensor to GROUND
// Connect a 10K resistor from pin 2 (data) to pin 1 (power) of the sensor

// Initialize DHT sensor.
// Note that older versions of this library took an optional third parameter to
// tweak the timings for faster processors.  This parameter is no longer needed
// as the current DHT reading algorithm adjusts itself to work on faster procs.
DHT dht1(DHTPIN, DHTTYPE);
DHT dht2(3,DHTTYPE);
// Generally, you should use "unsigned long" for variables that hold time
// The value will quickly become too large for an int to store
unsigned long previousMillis = 0;        // will store last time LED was updated

// constants won't change :
const long interval = 30000;           // interval at which to blink (milliseconds)

int pinState =0;
int lastState =0;
void setup() {
  Serial.begin(9600);
  Serial.println("DHT11s");
  pinMode(12, OUTPUT);
  pinMode(10,INPUT);
  dht1.begin();
  dht2.begin();
}

void loop() {
    unsigned long currentMillis = millis();
    pinState = digitalRead(10);
    if(pinState==HIGH)
    {    
      digitalWrite(12, HIGH);
      delay(1000);
      digitalWrite(12, LOW);
    }
   
  // Wait a few seconds between measurements.

  if(currentMillis - previousMillis>=interval){
    previousMillis = currentMillis;
  readValues(dht1, "garage");
  readValues(dht2, "attic");
  }
}


void readValues(DHT dht1, char id[]){

  // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
  float h = dht1.readHumidity();
  // Read temperature as Celsius (the default)
  float t = dht1.readTemperature();
  // Read temperature as Fahrenheit (isFahrenheit = true)
  float f = dht1.readTemperature(true);

  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t) || isnan(f)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Compute heat index in Fahrenheit (the default)
  //float hif = dht1.computeHeatIndex(f, h);
  // Compute heat index in Celsius (isFahreheit = false)
  //float hic = dht1.computeHeatIndex(t, h, false);

  Serial.print("{ \"humidity\": ");
  Serial.print(h);
  Serial.print(" , \"temperature\": ");
  Serial.print(t);
  Serial.print(" , \"deviceId\":\"");
  Serial.print(id);
  Serial.print("\"} \n");
}


