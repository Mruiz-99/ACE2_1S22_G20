const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'pozoapi',
    host: 'localhost',
    database: 'pozodb',
    password: 'ArquiApi',
    port: 5432
});

const fakeValue = [
    {
        id: 0,
        temp: 34.5,
        timestamp: '12:00:34 am'
    },
    {
        id: 1,
        temp: 30.0,
        timestamp: '12:01:34 am'
    },
    {
        id: 2,
        temp: 32.6,
        timestamp: '12:03:34 am'
    }
];

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


module.exports = {
    getTempRecordsCasa,
    getTempRecordsPozo
};