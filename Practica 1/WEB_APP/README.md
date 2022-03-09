## Como Iniciar el servidor backend
Para ejectar el frontend (WEBapp) se debe instalar [NodeJS](https://nodejs.org/es/download/)

Una vez instalado debe ingresarse a la ruta de la WEBapp y ejectura el comando: 

```bash
$ npm install
```
Para instalar todos los modulos necesarios

El WEBapp se conectara al API usando la ruta por defecto y el puerto por defecto, si estas se modificaron debe modificarse el archivo **package.json**

```json
"proxy": "http://localhost:7000"
```
Por la URL y puerto correcto

Para finalmente iniciar el WEBapp ejecutar el siguiente comando desde la raiz:

```bash
$ npm start
```