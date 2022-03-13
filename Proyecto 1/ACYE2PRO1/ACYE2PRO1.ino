
// Configuramos los pines del sensor Trigger y Echo
const int PinTrig = 13;
const int PinEcho = 12;

#define S10 3
#define S11 4
#define S12 5
#define S13 6
#define sensor1Out 7

#define S20 8
#define S21 9
#define S22 10
#define S23 11
#define sensor2Out 12

int redFrequency1 = 0;
int greenFrequency1 = 0;
int blueFrequency1 = 0;

int redFrequency2 = 0;
int greenFrequency2 = 0;
int blueFrequency2 = 0;

//pines humedad
const int PinH = A0;

// Constante velocidad sonido en cm/s
const float VelSon = 34000.0;
int StartTime=0;
float humedad = 0;

void setup()
{
  // salidas hacia sensor color 1
  pinMode(S10, OUTPUT);
  pinMode(S11, OUTPUT);
  pinMode(S12, OUTPUT);
  pinMode(S13, OUTPUT);
  //salidas hacia sensor color 2
  pinMode(S20, OUTPUT);
  pinMode(S21, OUTPUT);
  pinMode(S22, OUTPUT);
  pinMode(S23, OUTPUT);

  // entradas de señal de sensor de color
  pinMode(sensor1Out, INPUT);

  pinMode(sensor2Out, INPUT);
  //escala de lectura 20%
  digitalWrite(S10, HIGH);
  digitalWrite(S11, LOW);
  digitalWrite(S20, HIGH);
  digitalWrite(S21, LOW);
  // Iniciamos la comunicacion serie para enviar el resultado
  Serial.begin(9600);
  unsigned long StartTime = millis();//iniciar medicion tiempo;
  // Ponemos el pin Trig en modo salida
  pinMode(PinTrig, OUTPUT);
  // Ponemos el pin Echo en modo entrada
  pinMode(PinEcho, INPUT);

  StartTime = millis();
}
void loop()
{
  iniciarTrigger();

  // La función pulseIn obtiene el tiempo que tarda en cambiar entre estados, en este caso a HIGH
  unsigned long tiempo = pulseIn(PinEcho, HIGH);

  // Obtenemos la distancia en cm, hay que convertir el tiempo en segudos ya que está en microsegundos
  // por eso se multiplica por 0.000001
  float distancia = tiempo * 0.000001 * VelSon / 2.0;
  unsigned long CurrentTime = millis();//tiempo actual
  unsigned long ElapsedTime = CurrentTime - StartTime;//tiempo desde el inicio(milliseconds)
  ElapsedTime = ElapsedTime / 1000; //conversion de tiempo a segundos
  humedad = analogRead(PinH); //obtenemos valor humedad tierra
  humedad = humedad * (100 / 1023); //calculamos porcentaje de humedad en la tierra en base a los valores del sensor
  humedad = 100 - humedad; //obtenemos el porcentaje adecuado
  //fotodiodos rojos:
  digitalWrite(S12, LOW);
  digitalWrite(S13, LOW);
  redFrequency1 = pulseIn(sensor1Out, LOW);
  digitalWrite(S22, LOW);
  digitalWrite(S23, LOW);
  redFrequency2 = pulseIn(sensor2Out, LOW);
  //fotodiodos verdes:
  digitalWrite(S12, HIGH);
  digitalWrite(S13, HIGH);
  greenFrequency1 = pulseIn(sensor1Out, LOW);
  digitalWrite(S22, HIGH);
  digitalWrite(S23, HIGH);
  greenFrequency2 = pulseIn(sensor2Out, LOW);
  //fotodiodos azules:
  digitalWrite(S12, LOW);
  digitalWrite(S13, HIGH);
  blueFrequency1 = pulseIn(sensor1Out, LOW);
  digitalWrite(S22, LOW);
  digitalWrite(S23, HIGH);
  blueFrequency2 = pulseIn(sensor2Out, LOW);

  //enviar datos:
  Serial.println("cm:");
  Serial.println(distancia);

  Serial.println(redFrequency1);
  Serial.println(redFrequency2);
  Serial.println(greenFrequency1);
  Serial.println(greenFrequency2);
  Serial.println(blueFrequency1);
  Serial.println(blueFrequency2);
  Serial.println(humedad);



  delay(500);
}

// Método que inicia la secuencia del Trigger para comenzar a medir
void iniciarTrigger()
{
  // Ponemos el Triiger en estado bajo y esperamos 2 ms
  digitalWrite(PinTrig, LOW);
  delayMicroseconds(2);

  // Ponemos el pin Trigger a estado alto y esperamos 10 ms
  digitalWrite(PinTrig, HIGH);
  delayMicroseconds(10);

  // Comenzamos poniendo el pin Trigger en estado bajo
  digitalWrite(PinTrig, LOW);
}
