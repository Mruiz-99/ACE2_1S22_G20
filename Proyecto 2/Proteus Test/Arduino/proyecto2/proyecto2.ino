bool Llave = false; // Falso = cerrada
bool Chispa = false; // Falso = inactiva

void setup() {
  // Serial se usara para la comunicacion bt
  Serial.begin(9600);

  
}

void loop() {

  /* Leer valor de los sensores */
  // Codigo que lee los valores de los sensores
  // Temperatura y Metano

  
  /* Envia valores por bluetooth */
  
  // Enviar valores de los sensores
  // Usando el Serial del bluetooth
  // Formato: 'KEYWORD' VALOR
  // TEMP 123.5
  // METANO 145.67
  // User Serial.println() para que se envia linea por linea    

  /* Leer comandos recibidos por bluetooth */
  // Por Simplicidad cada comando sera solo una letra/char
  // L => abrir/cerrar Llave de paso
  // C => generar chispa -> 
  
  if(Serial.available() > 0) {
    char command = Serial.read(); 
    if(command == 'L'){
      Llave = !Llave;
      // Codigo que abre o cierra la llave de paso
      
      if(Llave){
        // Llave esta abierta, hay que cerrarla
      }else{
        // Llave esta cerrada, hay que abrirla
      }
    }else if(command == 'C'){
      Chispa = !Chispa;
      // Codigo que enciende la chispa
      
      if(Chispa){
        // Codigo que detiene la chispa
      }else{
        // Codigo que activa la chispa
      }
    }
  }
}
