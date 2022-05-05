#include <SoftwareSerial.h>
//#include <Servo.h>

SoftwareSerial miBT(10,11);
// Temporales para pruebas, cambiarlas o quitarlas de ser necesario
#include <DHT.h>
#include <DHT_U.h>
#define DHTPIN 2
#define DHTTYPE DHT11
float TEMPPIN = A0;
// Fin de Temporales

bool Llave = false; // Falso = cerrada <---
bool Chispa = false; // Falso = inactiva <---
//Servo servoMotor;//inicializacion motor
// Temporal 
DHT dht(DHTPIN,DHTTYPE);
// Fin Temporal

void setup() {
  // miBT se usara para la comunicacion bt
  miBT.begin(9600);
  //miBT.println("Esto no nos sale :(");
  pinMode(13,OUTPUT);
  pinMode(3,OUTPUT);
  pinMode(4,OUTPUT);
  //Temporal
  dht.begin();
//  servoMotor.attach(7);
  // Fin Temporal
  Serial.begin(9600);
  //Serial.println("Holis");
  //digitalWrite(3, HIGH);
  //digitalWrite(4, HIGH);
}

void loop() {
//miBT.println("aiudaaa");
//delay(1000);
  /* Leer valor de los sensores */
  // Codigo que lee los valores de los sensores
  // Temperatura y Metano
    /* Codigo temporal para pruebas */
    float temp = dht.readTemperature();
    float met = analogRead(TEMPPIN);
  
  /* Envia valores por bluetooth */
  
  // Enviar valores de los sensores
  // Usando el miBT del bluetooth
  // Formato: 'KEYWORD' VALOR
  // TEMP 123.5
  // METANO 145.67
  // User miBT.println() para que se envia linea por linea    
  miBT.print("TEMP ");
  miBT.println(temp);

  delay(100);
  
  miBT.print("METANO ");
  met=getMethane();
  miBT.println(met);

  /* Leer comandos recibidos por bluetooth */
  // Por Simplicidad cada comando sera solo una letra/char
  // L => Abrir llave de paso
  // M => Cerrar llave de paso
  
  // C => Activar generador de chispa
  // D => Detener generador de chispa
  
  if(Serial.available()) {
    //miBT.println("Entró");
    char command = Serial.read(); 
    //miBT.println(command);
    if(command == 'L'){
      Llave = true;
      miBT.println("Arduino: Abriendo llave");
      // Codigo que abre la llave de paso
      openGas();
    }else if(command == 'M'){
      Llave = false;
      miBT.println("Arduino: Cerrando llave");
      // Codigo que cierra la llave de paso
      closeGas();
    }else if(command == 'C'){
      Chispa = true;
      miBT.println("Arduino: Encendiendo Chispa");
      // Codigo que enciende la chispa
      digitalWrite(4, HIGH);
    }else if(command == 'D'){
      Chispa = false;
      miBT.println("Arduino: Apagando Chispa");
      // Codigo que apaga la chispa
      digitalWrite(4, LOW);
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
  //servoMotor.write(0);
  // Esperamos 1 segundo
  digitalWrite(3, HIGH);
  //delay(1000);
  
  // Desplazamos a la posición 90º
  //servoMotor.write(90);
  }
float closeGas(){
   // Desplazamos a la posición 0º
  //servoMotor.write(0);
  digitalWrite(3, LOW);
  }
