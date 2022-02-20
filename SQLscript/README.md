## Como configurar la DB
La base de datos debe ser implementada en PostgreSQL para que funcione sin mayores cambios en el API backend

Para instalar PostgreSQL puede hacer desde [aqui](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

Una vez instalado debe crearse un usuario y una base de datos con la siguiente informacion:

Se debe crear una DB con el nombre **pozodb** y las credenciales de accesso: 
Usuario: **pozoapi**, Password: **ArquiApi**

Estos valores no son obligatorios pero si se eligen otros deben modificarse en los otros modulos para que funcione correctamente

Una vez creada la base de datos y el usuario debe ejecutarse el script de creacion de las tablas desde PGadmin (ya incluido en la instalacion anterior)