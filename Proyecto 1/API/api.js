const GraphLimit = 50;
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'pozoapi',
    host: 'localhost',
    database: 'Jardin',
    password: 'ArquiApi',
    port: 5432
});

const getDistanceRecords = async (request, response) => {
    pool.query('SELECT * FROM DISTANCE ORDER BY timestamp DESC LIMIT 2', (error, result) => {
        response.status(200).json(result.rows);
    });
};

const getDistanceRecordsGL = async (request, response) => {
    pool.query(`SELECT * FROM (SELECT * FROM DISTANCE ORDER BY timestamp DESC LIMIT ${GraphLimit}) as Records ORDER BY timestamp ASC`, (error, result) => {
        response.status(200).json(result.rows);
    });
};

const getPreFilterRecords = async (request, response) => {
    pool.query('SELECT * FROM PREFILTER_WATER ORDER BY timestamp DESC LIMIT 2', (error, result) => {
        response.status(200).json(result.rows);
    });
};

const getPreFilterRecordsGL = async (request, response) => {
    pool.query(`SELECT * FROM (SELECT * FROM PREFILTER_WATER ORDER BY timestamp DESC LIMIT ${GraphLimit}) as Records ORDER BY timestamp ASC`, (error, result) => {
        response.status(200).json(result.rows);
    });
};

const getPostFilterRecords = async (request, response) => {
    pool.query('SELECT * FROM POSTFILTER_WATER ORDER BY timestamp DESC LIMIT 2', (error, result) => {
        response.status(200).json(result.rows);
    });
};

const getPostFilterRecordsGL = async (request, response) => {
    pool.query(`SELECT * FROM (SELECT * FROM POSTFILTER_WATER ORDER BY timestamp DESC LIMIT ${GraphLimit}) as Records ORDER BY timestamp ASC`, (error, result) => {
        response.status(200).json(result.rows);
    });
};

const getHumidityRecords = async (request, response) => {
    pool.query('SELECT * FROM Humidity ORDER BY timestamp DESC LIMIT 2', (error, result) => {
        // Correcion para mostrar %
        result.rows.forEach((item) =>{
            item.value = 100-(item.nivel/10.23);
            item.value = Math.round((item.value + Number.EPSILON)*100)/100;
        });
        response.status(200).json(result.rows);
    });
};

const getHumidityRecordsGL = async (request, response) => {
    pool.query(`SELECT * FROM (SELECT * FROM Humidity ORDER BY timestamp DESC LIMIT ${GraphLimit}) as Records ORDER BY timestamp ASC`, (error, result) => {
        // Correcion para mostrar %
        result.rows.forEach((item) =>{
            item.value = 100-(item.nivel/10.23);
            item.value = Math.round((item.value + Number.EPSILON)*100)/100;
        });
        response.status(200).json(result.rows);
    });
};


const addDistanceRecord = async (request, response) => {
    const { value } = request.body;
    console.log(`Insertando nuevo valor de distancia: ${value} cm `);
    pool.query(`INSERT INTO DISTANCE (value) VALUES (${value})`, (error, result) => {
        if(error){
            response.status(400).json('Error al registrar la nueva distancia');
        }else{
            response.status(200).json(`Se inserto ${result.rowCount} valor nuevo: ${value} cm`);
        }        
    });
}

const addPreFilterRecord = async (request, response) => {
    const { red, green, blue } = request.body;
    console.log(`Insertando nuevo valor de color (Antes del Filtro) -> RED: ${red} GREEN: ${green} BLUE: ${blue}`);
    pool.query(`INSERT INTO PREFILTER_WATER (R, G, B) VALUES (${red},${green},${blue})`, (error, result) => {
        if(error){
            response.status(400).json('Error al registrar el nuevo color');
        }else{
            response.status(200).json(`Se inserto ${result.rowCount} valor nuevo -> RED: ${red} GREEN: ${green} BLUE: ${blue}`);
        }        
    });
}

const addPostFilterRecord = async (request, response) => {
    const { red, green, blue } = request.body;
    console.log(`Insertando nuevo valor de color (Despues del Filtro) -> RED: ${red} GREEN: ${green} BLUE: ${blue}`);
    pool.query(`INSERT INTO POSTFILTER_WATER (R, G, B) VALUES (${red},${green},${blue})`, (error, result) => {
        if(error){
            response.status(400).json('Error al registrar el nuevo color');
        }else{
            response.status(200).json(`Se inserto ${result.rowCount} valor nuevo -> RED: ${red} GREEN: ${green} BLUE: ${blue}`);
        }        
    });
}

const addHumidityRecord = async (request, response) => {
    const { value } = request.body;
    let apvalue = 100-(value/10.23);
    apvalue = Math.round((apvalue + Number.EPSILON)*100)/100;
    console.log(`Insertando nuevo valor de Humedad: ${apvalue} %`);
    pool.query(`INSERT INTO Humedad (Value) VALUES (${value})`, (error, result) => {
        if(error){
            response.status(400).json('Error al registrar el nuevo nivel de CO2');
        }else{
            response.status(200).json(`Se inserto ${result.rowCount} valor nuevo: ${apvalue}%`);
        }        
    });
}

module.exports = {
    getDistanceRecords,
    getDistanceRecordsGL,
    getPreFilterRecords,
    getPreFilterRecordsGL,
    getPostFilterRecords,
    getPostFilterRecordsGL,
    getHumidityRecords,
    getHumidityRecordsGL,
    addDistanceRecord,
    addPreFilterRecord,
    addPostFilterRecord,
    addHumidityRecord
};