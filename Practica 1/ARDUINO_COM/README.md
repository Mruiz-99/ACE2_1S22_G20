## Como Iniciar el servidor ARDUINO_COM

Para ejectar el servidor de comunicacion entre el API y Arduino se debe instalar [NodeJS](https://nodejs.org/es/download/)

Una vez instalado debe ingresarse a la ruta del servidor y ejecutar el comando: 

```bash
$ npm install
```
Para instalar todos los modulos necesarios

Se debe configurar el puerto COM desde donde se recibiran los comandos de Arduino en el archivo app.js

```javascript
const ARDUINO_COM ="COM2";
```
Reemplazando "COM2" por el COM donde este conectado el arduino

Y la URL para las peticiones a la API:

```javascript
const API_SERVER = "http://localhost:7000";
```

Si los valores por defecto de la API no se cambiaron deberia quedarse igual

Para finalmente iniciar el servidor ejecutar el siguiente comando desde la raiz:

```bash
$ npm run serve
```

## ARDUINO->API Funcionamiento
Servidor que recibe los comandos desde el COM del arduino y parsea los comandos para insertar la informacion en la DB a traves de la API

Descripcion del protocolo de comunicacion serial: <br/>
**[COMANDO]** **[VALOR]**
Donde comando puede ser: 
```
LUMENS: Comando para enviar dato de iluminacion
TEMPC: Comando para datos de temperatura de la casa
TEMPP: Comando para datos de temperatura del pozo
HUMIDITY: Comando para datos de humedad
CO2PPM: Comando para datos de CO2 ppm
```
Ejemplo: **TEMPC 28.3** | **CO2PPM 234.45**


