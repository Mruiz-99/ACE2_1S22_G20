## Como Iniciar el servidor backend
Para ejectar el backend (APIrest) se debe instalar PostgreSQL [Se puede descargar aqui](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

Se debe instalar tambien [NodeJS](https://nodejs.org/es/download/)

Una vez instalado debe ingresarse a la ruta de la API y ejectura el comando: 

```bash
$ npm install
```
Para instalar todos los modulos necesarios

Para elegir un puerto diferente que el por defecto (7000, se recomienda no cambiarlo) puede hacerse en el archivo app.js

```javascript
const port = 7000;
```

Y la conexion a la base de datos de PostgreSQL debe configurarse en el archivo api.js

```javascript
const pool = new Pool({
    user: 'usuario de la db en postgresql',
    host: 'localhost',
    database: 'nombre dela db en postgresql',
    password: 'contraseña del usuario',
    port: 5432 // asumiento que no se cambio por defecto
});
```

Para finalmente iniciar el servidor ejecutar el siguiente comando desde la raiz de la API:

```bash
$ npm run serve
```

#### GET / POST de la API

Para interactuar con la api se pueden realizar las siguientes peticiones post/get que devolveran informacion en formato JSON

##### Agregar temperatura de la casa o el pozo: 
 **POST:** /addTempRecord/Casa/ <br/>
 **POST:** /addTempRecord/Pozo/ <br/>
 Con el siguiente formato en el body
 ```json
 {
     "temp": 10.34 
 }
 ```
 
 ##### Agregar nivel de iluminacion: 
 **POST:** /addLumenRecord/ <br/>
 Con el siguiente formato en el body <br/>
 ```json
 {
     "lumens": 234 
 }
 ```
 
 ##### Agregar nivel de CO2: 
 **POST:** /addCO2Record/ <br />
 Con el siguiente formato en el body <br/>
 ```json
 {
     "ppm": 23.4 
 }
 ```
 
 ##### Agregar nivel de CO2: 
 **POST:** /addHumidityRecord/ <br/>
 Con el siguiente formato en el body <br/>
 ```json
 {
     "porcentaje": 15 
 }
 ```
