#include <Servo.h>

// Temporales para pruebas, cambiarlas o quitarlas de ser necesario
#include <DHT.h>
#include <DHT_U.h>
#define DHTPIN 2
#define DHTTYPE DHT11
float TEMPPIN = A0;
// Fin de Temporales

bool Llave = false; // Falso = cerrada
bool Chispa = false; // Falso = inactiva
Servo servoMotor;//inicializacion motor
// Temporal 
DHT dht(DHTPIN,DHTTYPE);
// Fin Temporal

void setup() {
  // Serial se usara para la comunicacion bt
  Serial.begin(9600);
  pinMode(13,OUTPUT);
  //Temporal
  dht.begin();
  servoMotor.attach(7);
  // Fin Temporal

  
}

void loop() {

  /* Leer valor de los sensores */
  // Codigo que lee los valores de los sensores
  // Temperatura y Metano
    /* Codigo temporal para pruebas */
    float temp = dht.readTemperature();
    float met = analogRead(TEMPPIN);
  
  /* Envia valores por bluetooth */
  
  // Enviar valores de los sensores
  // Usando el Serial del bluetooth
  // Formato: 'KEYWORD' VALOR
  // TEMP 123.5
  // METANO 145.67
  // User Serial.println() para que se envia linea por linea    
  Serial.print("TEMP ");
  Serial.println(temp);

  delay(100);
  
  Serial.print("METANO ");
  met=getMethane();
  Serial.println(met);

  /* Leer comandos recibidos por bluetooth */
  // Por Simplicidad cada comando sera solo una letra/char
  // L => Abrir llave de paso
  // M => Cerrar llave de paso
  
  // C => Activar generador de chispa
  // D => Detener generador de chispa
  
  if(Serial.available() > 0) {
    char command = Serial.read(); 
    if(command == 'L'){
      Llave = true;
      // Codigo que abre la llave de paso
      openGas();
    }else if(command == 'M'){
      Llave = false;
      // Codigo que cierra la llave de paso
      closeGas();
    }else if(command == 'C'){
      Chispa = true;
      // Codigo que enciende la chispa
      digitalWrite(13, HIGH);
    }else if(command == 'D'){
      Chispa = false;
      // Codigo que apaga la chispa
      digitalWrite(13, LOW);
    }
  }

  delay(800);
}
float getMethane(){
  int R0=945;
  float metRead=analogRead(TEMPPIN);
  float v=metRead * 5/1023;
  float Rs=(5-v)*1000/v;
  float ppm=pow(Rs/R0,-2.95)*1000;
  return ppm;
  }
float openGas(){
   // Desplazamos a la posición 0º
  servoMotor.write(0);
  // Esperamos 1 segundo
  delay(1000);
  
  // Desplazamos a la posición 90º
  servoMotor.write(90);
  }
float closeGas(){
   // Desplazamos a la posición 0º
  servoMotor.write(0);
  }
