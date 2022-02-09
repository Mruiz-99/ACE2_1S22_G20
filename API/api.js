const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'pozoapi',
    host: 'localhost',
    database: 'pozodb',
    password: 'ArquiApi',
    port: 5432
});

const getTempRecordsCasa = async (request, response) => {
    pool.query('SELECT * FROM Temp_Casa', (error, result) => {
        response.status(200).json(result.rows);
    });
};


const getTempRecordsPozo = async (request, response) => {
    pool.query('SELECT * FROM Temp_Pozo', (error, result) => {
        response.status(200).json(result.rows);
    });
};

const addTempRecordCasa = async (request, response) => {
    const { temp } = request.body;
    pool.query(`INSERT INTO Temp_Casa (Temperatura) VALUES (${temp})`, (error, result) => {
        if(error){
            response.status(400).json('Error al registrar la nueva temperatura');
        }else{
            response.status(200).json(`Se inserto ${result.rowCount} valor nuevo: ${temp} °C`);
        }        
    });
}

const addTempRecordPozo = async (request, response) => {
    const { temp } = request.body;
    pool.query(`INSERT INTO Temp_Pozo (Temperatura) VALUES (${temp})`, (error, result) => {
        if(error){
            response.status(400).json('Error al registrar la nueva temperatura');
        }else{
            response.status(200).json(`Se inserto ${result.rowCount} valor nuevo: ${temp} °C`);
        }        
    });
}


const addLumenRecord = async (request, response) => {
    const { lumens } = request.body;
    pool.query(`INSERT INTO Luz (Nivel) VALUES (${lumens})`, (error, result) => {
        if(error){
            response.status(400).json('Error al registrar el nuevo nivel de lumens');
        }else{
            response.status(200).json(`Se inserto ${result.rowCount} valor nuevo: ${lumens} lumens`);
        }        
    });
}

const addCO2Record = async (request, response) => {
    const { ppm } = request.body;
    pool.query(`INSERT INTO CO2 (Nivel) VALUES (${ppm})`, (error, result) => {
        if(error){
            response.status(400).json('Error al registrar el nuevo nivel de CO2');
        }else{
            response.status(200).json(`Se inserto ${result.rowCount} valor nuevo: ${ppm} CO2 ppm`);
        }        
    });
}


const addHumidityRecord = async (request, response) => {
    const { porcentaje } = request.body;
    pool.query(`INSERT INTO Humedad (Nivel) VALUES (${porcentaje})`, (error, result) => {
        if(error){
            response.status(400).json('Error al registrar el nuevo nivel de CO2');
        }else{
            response.status(200).json(`Se inserto ${result.rowCount} valor nuevo: ${porcentaje}%`);
        }        
    });
}

module.exports = {
    getTempRecordsCasa,
    getTempRecordsPozo,
    addTempRecordCasa,
    addTempRecordPozo,
    addLumenRecord,
    addCO2Record,
    addHumidityRecord
};