# ACE2_1S22_G20
 Arquitectura de Computadores y Ensambladores 2<br />
 Grupo 20<br />
 Mynor Rene Ruiz Guerra            201801329<br />
 Steven S. Jocol Gomez             201602938<br />
 Bryan Vladimir Hernández Del Cid  201700672<br />
 Ronald Oswaldo Macal de León      201612151<br />
 Virginia Sarai Gutierrez Depaz    201504443


## NODEJS API Funcionamiento

El api se conecta a una base de datos de PostgreSQL usando Express y PG<br />

Pueden instalarse con el comando: <br />
```bash 
npm i pg y npm i express
```

Para conectar a la base de datos se require colocar los datos correctos en el archivo api.js de la siguiente manera: <br />

~~~javascript
const pool = new Pool({
    user: 'usuario de la db en postgresql',
    host: 'localhost',
    database: 'nombre dela db en postgresql',
    password: 'contraseña del usuario',
    port: 5432 // asumiento que no se cambio por defecto
});
~~~

#### GET / POST de la API

Para interactuar con la api se pueden realizar las siguientes peticiones post/get que devolveran informacion en formato JSON

##### Agregar temperatura de la casa o el pozo: 
 **POST:** /addTempRecord/Casa/ <br />
 **POST:** /addTempRecord/Pozo/ <br />
 Con el siguiente formato en el body
 ```json
 {
     "temp": 10.34 
 }
 ```
 
 ##### Agregar nivel de iluminacion: 
 **POST:** /addLumenRecord/ <br />
 Con el siguiente formato en el body <br />
 ```json
 {
     "lumens": 234 
 }
 ```
 
 ##### Agregar nivel de CO2: 
 **POST:** /addCO2Record/ <br />
 Con el siguiente formato en el body <br />
 ```json
 {
     "ppm": 23.4 
 }
 ```
 
 ##### Agregar nivel de CO2: 
 **POST:** /addHumidityRecord/ <br />
 Con el siguiente formato en el body <br />
 ```json
 {
     "porcentaje": 15 
 }
 ```
