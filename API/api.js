const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'pozoapi',
    host: 'localhost',
    database: 'pozodb',
    password: 'ArquiApi',
    port: 5432
});

const getTempRecordsCasa = async (request, response) => {
    pool.query('SELECT * FROM Temp_Casa ORDER BY timestamp DESC LIMIT 2', (error, result) => {
        response.status(200).json(result.rows);
    });
};


const getTempRecordsPozo = async (request, response) => {
    pool.query('SELECT * FROM Temp_Pozo ORDER BY timestamp DESC LIMIT 2', (error, result) => {
        response.status(200).json(result.rows);
    });
};

const getLumenRecords = async (request, response) => {
    pool.query('SELECT * FROM Luz ORDER BY timestamp DESC LIMIT 2', (error, result) => {
        response.status(200).json(result.rows);
    });
};

const getHumidityRecords = async (request, response) => {
    pool.query('SELECT * FROM Humedad ORDER BY timestamp DESC LIMIT 2', (error, result) => {
        response.status(200).json(result.rows);
    });
};

const getCO2Records = async (request, response) => {
    pool.query('SELECT * FROM CO2 ORDER BY timestamp DESC LIMIT 2', (error, result) => {
        response.status(200).json(result.rows);
    });
};

const addTempRecordCasa = async (request, response) => {
    const { temp } = request.body;
    console.log(`Insertando nuevo valor de Temperatura (Casa): ${temp} °C `);
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
    console.log(`Insertando nuevo valor de Temperatura (Pozo): ${temp} °C `);
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
    console.log(`Insertando nuevo valor de Iluminacion: ${lumens} lumens`);
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
    console.log(`Insertando nuevo valor de CO2: ${ppm} ppm`);
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
    console.log(`Insertando nuevo valor de Humedad: ${porcentaje} %`);
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
    getHumidityRecords,
    getCO2Records,
    getLumenRecords,
    addTempRecordCasa,
    addTempRecordPozo,
    addLumenRecord,
    addCO2Record,
    addHumidityRecord
};