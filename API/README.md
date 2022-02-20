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