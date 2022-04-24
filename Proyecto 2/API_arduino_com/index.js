// API variables
const express = require('express');
const cors = require('cors');
const app = express();
const api = require('./api');
const port = 7000;

// COM attached to bluetooth
const ARDUINO_COM ="COM1";

// Command Constants
const TEMPERATURE = "TEMP";
const METHANE = "METANO";

const serialPort = require('serialport');
var createInterface = require('readline').createInterface;
var arduino = new serialPort(ARDUINO_COM, {baudRate: 9600});

var lineReader = createInterface({
    input: arduino
});

async function sendCommand(command){
    return arduino.write(command, function (err){
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
    
    if(value){
        console.log(`Enviando comando para encender chispa`);
        const result = await sendCommand('C');
        if(result){
            api.updateSpark('true', response);
        }else{
            response.status(200).json({result: 'Command Error'});
        }
    }else{
        console.log(`Enviando comando para apagar chispa`);
        if(sendCommand('D')){
            api.updateSpark('false', response);
        }else{
            response.status(200).json({result: 'Command Error'});
        }
    }
}

const setValveStatus = async (request, response) => {
    const { value } = request.body;
    
    if(value){
        console.log(`Enviando comando para abrir llave`);
        const result = await sendCommand('L');

        if(sendCommand('L')){
            api.updateValve('true',response);
        }else{
            response.status(200).json({result: 'Command Error'});
        }
    }else{
        console.log(`Enviando comando para cerrar llave`);
        const result = await sendCommand('M');
        if(result){
            api.updateValve('false',response);
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
app.get('/getMethaneRecords/', api.getMethaneRecords);
app.get('/getTempRecords/GraphInit/', api.getTempRecordsGL);
app.get('/getMethaneRecords/GraphInit/', api.getMethaneRecordsGL);

app.post('/setSpark/', setSparkStatus);
app.post('/setValve/', setValveStatus);


