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

const getTempRecordsGLR = async (request, response) => {
    const { start, end } = request.body;
    pool.query(`SELECT * FROM (SELECT * FROM TEMPERATURE WHERE TIMESTAMP >= '${start}' AND TIMESTAMP <= '${end}' ORDER BY timestamp DESC) as Records ORDER BY timestamp ASC`, (error, result) => {
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

const getMethaneRecordsGLR = async (request, response) => {
    const { start, end } = request.body;
    pool.query(`SELECT * FROM (SELECT * FROM METHANE WHERE TIMESTAMP >= '${start}' AND TIMESTAMP <= '${end}' ORDER BY timestamp DESC) as Records ORDER BY timestamp ASC`, (error, result) => {
        response.status(200).json(result.rows);
    });
};

const getStatusRecords = async (request, response) => {
    pool.query('SELECT * FROM STATUS ORDER BY timestamp DESC LIMIT 2', (error, result) => {
        response.status(200).json(result.rows);
    });
};

const getStatusRecordsGL = async (request, response) => {
    pool.query(`SELECT * FROM (SELECT * FROM STATUS ORDER BY timestamp DESC LIMIT ${GraphLimit+300}) as Records ORDER BY timestamp ASC`, (error, result) => {
        response.status(200).json(result.rows);
    });
};

const getStatusTempRecordsGLR = async (request, response) => {
    const { start, end } = request.body;
    pool.query(`SELECT * FROM (SELECT * FROM STATUS WHERE TIMESTAMP >= '${start}' AND TIMESTAMP <= '${end}' ORDER BY timestamp DESC) as Records ORDER BY timestamp ASC`, (error, result) => {
        response.status(200).json(result.rows);
    });
};

const addTempRecord = async (value) => {
    console.log(`Insertando nuevo valor de temperatura: ${value} °C `);
    pool.query(`INSERT INTO TEMPERATURE (value) VALUES (${value})`, (error, result) => {
        if(error){
            console.log('Error al registrar la nueva temperatura');
        }else{
            console.log(`Se inserto ${result.rowCount} valor nuevo de temperatura: ${value} °C`);
        }        
    });
}

const addMethaneRecord = async (value) => {
    console.log(`Insertando nuevo valor de gas metano: ${value} `);
    pool.query(`INSERT INTO METHANE (value) VALUES (${value})`, (error, result) => {
        if(error){
            console.log('Error al registrar el nuevo valor de metano');
        }else{
            console.log(`Se inserto ${result.rowCount} valor nuevo de metano: ${value}`);
        }        
    });
}

const getStatus = async (request, response) => {
    pool.query('SELECT * FROM STATUS ORDER BY TIMESTAMP DESC LIMIT 1', (error, result) => {
        response.status(200).json(result.rows);
    });
}

const updateSpark = async (value, vvalue, response) => {
    pool.query(`INSERT INTO STATUS (valve, spark) VALUES (${String(vvalue)}, ${String(value)});`, (error, _) => {
        if(error){
            response.status(200).json({result: 'Err'});
        }else{
            response.status(200).json({result: 'Ok'});
        }
    });
}

const updateValve = async (value, svalue, response) => {
    pool.query(`INSERT INTO STATUS (valve, spark) VALUES (${String(value)}, ${String(svalue)});`, (error, _) => {
        if(error){
            response.status(200).json({result: 'Err'});
        }else{
            response.status(200).json({result: 'Ok'});
        }
    });
}

module.exports = {
    getTempRecords,
    getTempRecordsGL,
    getTempRecordsGLR,
    getMethaneRecords,
    getMethaneRecordsGL,
    getMethaneRecordsGLR,
    getStatusRecords,
    getStatusRecordsGL,
    getStatusTempRecordsGLR,
    addTempRecord,
    addMethaneRecord,
    getStatus,
    updateSpark,
    updateValve
};