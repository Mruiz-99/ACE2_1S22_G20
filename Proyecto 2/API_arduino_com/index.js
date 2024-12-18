// API variables
const express = require('express');
const cors = require('cors');
const app = express();
const api = require('./api');
const port = 7000;

let lastValve = false;
let lastSpark = false;

// COM attached to bluetooth
const ARDUINO_COM_IN ="COM4"; // Bluetooth
const ARDUINO_COM_OUT ="COM3"; // COM de conexion en cable

// Command Constants
const TEMPERATURE = "TEMP";
const METHANE = "METANO";

const serialPort = require('serialport');
var createInterface = require('readline').createInterface;
var arduino_in = new serialPort(ARDUINO_COM_IN, {baudRate: 9600});
var arduino_out = new serialPort(ARDUINO_COM_OUT, {baudRate: 9600});

var lineReader = createInterface({
    input: arduino_in
});

async function sendCommand(command){
    return arduino_out.write(command, function (err){
        if(err){
            return false;
        }else{
            return true;
        }
    });
}

// Parse Sensor New Values

lineReader.on('line', (line) => {
    if(line.includes(TEMPERATURE)){
        const val = line.replace(TEMPERATURE,"").replace(" ","");
        api.addTempRecord(val);
    }else if(line.includes(METHANE)){
        const val = line.replace(METHANE,"").replace(" ","");
        api.addMethaneRecord(val);
    }else{
        console.log("Unrecognized Command: ",line);
    }
});


// Trigger Command on bluetooth com 

const setSparkStatus = async (request, response) => {
    const { value } = request.body;
    
    lastSpark = value;
    if(value){
        console.log(`Enviando comando para encender chispa`);
        const result = await sendCommand('C');
        if(result){
            api.updateSpark('true', lastValve, response);
        }else{
            response.status(200).json({result: 'Command Error'});
        }
    }else{
        console.log(`Enviando comando para apagar chispa`);
        if(sendCommand('D')){
            api.updateSpark('false', lastValve, response);
        }else{
            response.status(200).json({result: 'Command Error'});
        }
    }
}

const setValveStatus = async (request, response) => {
    const { value } = request.body;
    
    lastValve = value;
    if(value){
        console.log(`Enviando comando para abrir llave`);
        const result = await sendCommand('L');

        if(sendCommand('L')){
            api.updateValve('true', lastSpark,response);
        }else{
            response.status(200).json({result: 'Command Error'});
        }
    }else{
        console.log(`Enviando comando para cerrar llave`);
        const result = await sendCommand('M');
        if(result){
            api.updateValve('false', lastSpark,response);
        }else{
            response.status(200).json({result: 'Command Error'});
        }
    }
}

// Init API
app.use(cors());
app.use(express.json());
app.listen(port, () => {
    console.log(`IoT API is running on port ${port}`);
});

// Set Entry Points
app.get('/getStatus/', api.getStatus);
app.get('/getTempRecords/', api.getTempRecords);
app.get('/getStatusRecords/', api.getStatusRecords);
app.get('/getMethaneRecords/', api.getMethaneRecords);
app.get('/getTempRecords/GraphInit/', api.getTempRecordsGL);
app.get('/getMethaneRecords/GraphInit/', api.getMethaneRecordsGL);
app.get('/getStatusRecords/GraphInit/', api.getStatusRecordsGL);

app.post('/getTempRecords/GraphInit/', api.getTempRecordsGLR);
app.post('/getMethaneRecords/GraphInit/', api.getMethaneRecordsGLR);
app.post('/getStatusRecords/GraphInit/', api.getStatusTempRecordsGLR);

app.post('/setSpark/', setSparkStatus);
app.post('/setValve/', setValveStatus);


