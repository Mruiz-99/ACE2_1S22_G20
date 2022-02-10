const axios = require('axios');
const API_SERVER = "http://localhost:7000";
const LUMEN = "LUMENS";
const TEMP_CASA = "TEMPC";
const TEMP_POZO = "TEMPP";
const HUMIDITY = "HUMIDITY";
const CO2PPM = "CO2PPM";

// COM1 puerto virtual que envia la informacion (de pruebas de Proteus)
// COM2 puerto virtual que recibe la informacion (de pruebas de Proteus)

const serialPort = require('serialport');
var createInterface = require('readline').createInterface;
var arduino = new serialPort("COM2", {baudRate: 9600});

var lineReader = createInterface({
    input: arduino
});

console.log("Arduino Listener Running...");

lineReader.on('line', (line) => {
    if(line.includes(LUMEN)){
        const val = line.replace(LUMEN,"").replace(" ","");
        console.log(`Enviando peticion a: ${API_SERVER}/addLumenRecord/`)
        axios.post(`${API_SERVER}/addLumenRecord/`, {
            lumens: parseFloat(val)
        })
        .then(res => {
            console.log(res.data);
        })
        .catch(error => {
            console.log("La peticion a http://localhost:7000/addLumenRecord/ fallo: ",error);
        });
    }else if(line.includes(TEMP_CASA)){
        const val = line.replace(TEMP_CASA,"").replace(" ","");
        console.log(`Enviando peticion a: ${API_SERVER}/addTempRecord/Casa/`)
        axios.post(`${API_SERVER}/addTempRecord/Casa/`, {
            temp: parseFloat(val)
        })
        .then(res => {
            console.log(res.data);
        })
        .catch(error => {
            console.log("La peticion a http://localhost:7000/addTempRecord/Casa/ fallo: ",error);
        });
    }else if(line.includes(TEMP_POZO)){
        const val = line.replace(TEMP_POZO,"").replace(" ","");
        console.log(`Enviando peticion a: ${API_SERVER}/addTempRecord/Pozo/`)
        axios.post(`${API_SERVER}/addTempRecord/Pozo/`, {
            temp: parseFloat(val)
        })
        .then(res => {
            console.log(res.data);
        })
        .catch(error => {
            console.log("La peticion a http://localhost:7000/addTempRecord/Pozo/ fallo: ",error);
        });
    }else if(line.includes(HUMIDITY)){
        const val = line.replace(HUMIDITY,"").replace(" ","");
        console.log(`Enviando peticion a: ${API_SERVER}/addHumidityRecord/`)
        axios.post(`${API_SERVER}/addHumidityRecord/`, {
            porcentaje: parseFloat(val)
        })
        .then(res => {
            console.log(res.data);
        })
        .catch(error => {
            console.log("La peticion a http://localhost:7000/addHumidityRecord/ fallo: ",error);
        });
    }else if(line.includes(CO2PPM)){
        const val = line.replace(CO2PPM,"").replace(" ","");
        console.log(`Enviando peticion a: ${API_SERVER}/addCO2Record/`)
        axios.post(`${API_SERVER}/addCO2Record/`, {
            ppm: parseFloat(val)
        })
        .then(res => {
            console.log(res.data);
        })
        .catch(error => {
            console.log("La peticion a http://localhost:7000/addCO2Record/ fallo: ",error);
        });
    }else{
        console.log("Unrecognized Command: ",line);
    }
});
