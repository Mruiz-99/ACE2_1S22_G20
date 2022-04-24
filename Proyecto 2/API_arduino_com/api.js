const GraphLimit = 50;
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'pozoapi',
    host: 'localhost',
    database: 'Estufa',
    password: 'ArquiApi',
    port: 5432
});

const getTempRecords = async (request, response) => {
    pool.query('SELECT * FROM TEMPERATURE ORDER BY timestamp DESC LIMIT 2', (error, result) => {
        response.status(200).json(result.rows);
    });
};

const getTempRecordsGL = async (request, response) => {
    pool.query(`SELECT * FROM (SELECT * FROM TEMPERATURE ORDER BY timestamp DESC LIMIT ${GraphLimit+300}) as Records ORDER BY timestamp ASC`, (error, result) => {
        response.status(200).json(result.rows);
    });
};

const getMethaneRecords = async (request, response) => {
    pool.query('SELECT * FROM METHANE ORDER BY timestamp DESC LIMIT 2', (error, result) => {
        response.status(200).json(result.rows);
    });
};

const getMethaneRecordsGL = async (request, response) => {
    pool.query(`SELECT * FROM (SELECT * FROM METHANE ORDER BY timestamp DESC LIMIT ${GraphLimit+300}) as Records ORDER BY timestamp ASC`, (error, result) => {
        response.status(200).json(result.rows);
    });
};



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