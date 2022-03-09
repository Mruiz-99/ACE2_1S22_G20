#include <DHT.h>
#include <DHT_U.h>
#define DHTPIN 2
#define DHTTYPE DHT11
int LUMENPIN = A8;
int TEMPPIN = A9;
int CO2PIN = A10;

DHT dht(DHTPIN,DHTTYPE);
void setup() {
  dht.begin();
  Serial.begin(9600);
}

void loop() {
  // Leer valores del pozo con unico sensor DHT22
  float humedadPozo = dht.readHumidity();
  float tempPozo = dht.readTemperature();

  // Leer valor de temperatura con unico sensor LM35
  float tempCasa = analogRead(TEMPPIN)*5*100/1024;

  // Leer valor de iluminacion con sensor LDR
  float lumenRead = analogRead(LUMENPIN);

  // Leer valor de CO2 con sensor MQ-7
  float co2Read = analogRead(CO2PIN);
  
  Serial.print("LUMENS ");
  Serial.println(lumenRead);

  Serial.print("TEMPC ");
  Serial.println(tempCasa);

  if(!isnan(tempPozo)){
    Serial.print("TEMPP");
    Serial.println(tempPozo);
  }

  if(!isnan(humedadPozo)){
    Serial.print("HUMIDITY ");
    Serial.println(humedadPozo);
  } 

  Serial.print("CO2PPM ");
  Serial.println(co2Read);
  delay(500);
}
