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
  
  Serial.print("DISTANCE ");
  Serial.println(lumenRead);

  Serial.print("PREFILTER ");
  Serial.print(co2Read);
  Serial.print(" ");
  Serial.print(tempCasa);
  Serial.print(" ");
  if(!isnan(tempPozo)){
    Serial.println(tempPozo);
  }else{
    Serial.println("0");
  }

  Serial.print("POSTFILTER ");
  Serial.print(tempCasa);
  Serial.print(" ");
  Serial.print(co2Read);
  Serial.print(" ");
  if(!isnan(tempPozo)){
    Serial.println(tempPozo);
  }else{
    Serial.println("0");
  }

  if(!isnan(humedadPozo)){
    Serial.print("HUMIDITY ");
    Serial.println(humedadPozo);
  } 

  
  delay(500);
}
