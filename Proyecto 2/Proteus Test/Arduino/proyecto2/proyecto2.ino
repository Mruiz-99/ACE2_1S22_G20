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
  // L => Abrir llave de paso
  // M => Cerrar llave de paso
  
  // C => Activar generador de chispa
  // D => Detener generador de chispa
  
  if(Serial.available() > 0) {
    char command = Serial.read(); 
    if(command == 'L'){
      Llave = true;
      // Codigo que abre la llave de paso
    }else if(command == 'M'){
      Llave = false;
      // Codigo que cierra la llave de paso
    }else if(command == 'C'){
      Chispa = true;
      // Codigo que enciende la chispa
    }else if(command == 'D'){
      Chispa = false;
      // Codigo que apaga la chispa
    }
  }
}
