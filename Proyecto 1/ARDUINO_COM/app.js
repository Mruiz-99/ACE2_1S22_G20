const axios = require('axios');
const API_SERVER = "http://localhost:7000";
const DISTANCE = "DISTANCE";
const PREFILTER = "PREFILTER ";
const POSTFILTER = "POSTFILTER ";
const HUMIDITY = "HUMIDITY";

const ARDUINO_COM ="COM3";

const serialPort = require('serialport');
var createInterface = require('readline').createInterface;
var arduino = new serialPort(ARDUINO_COM, {baudRate: 9600});

var lineReader = createInterface({
    input: arduino
});

console.log(`Arduino Listener Running on ${ARDUINO_COM}...`);

lineReader.on('line', (line) => {
    if(line.includes(DISTANCE)){
        const val = line.replace(DISTANCE,"").replace(" ","");
        console.log(`Enviando peticion a: ${API_SERVER}/addDistanceRecord/`)
        axios.post(`${API_SERVER}/addDistanceRecord/`, {
            value: parseFloat(val)
        })
        .then(res => {
            console.log(res.data);
        })
        .catch(error => {
            console.log("La peticion a http://localhost:7000/addDistanceRecord/ fallo: ",error);
        });
    }else if(line.includes(PREFILTER)){
        const val = line.replace(PREFILTER,"");
        const red = parseInt(val.split(" ")[0]);
        const green = parseInt(val.split(" ")[1]);
        const blue = parseInt(val.split(" ")[2]);

        console.log(`Leyendo valor de color (Antes del Filtro) -> RED: ${red} GREEN: ${green} BLUE: ${blue}`);
        
        console.log(`Enviando peticion a: ${API_SERVER}/addPreFilterRecord/`)
        axios.post(`${API_SERVER}/addPreFilterRecord/`, {
            red: red,
            green: green,
            blue: blue
        })
        .then(res => {
            console.log(res.data);
        })
        .catch(error => {
            console.log(`Enviando peticion a: ${API_SERVER}/addPreFilterRecord/ fallo: `,error);
        });
    }else if(line.includes(POSTFILTER)){
        const val = line.replace(POSTFILTER,"");
        const red = parseInt(val.split(" ")[0]);
        const green = parseInt(val.split(" ")[1]);
        const blue = parseInt(val.split(" ")[2]);

        console.log(`Leyendo valor de color (Antes del Filtro) -> RED: ${red} GREEN: ${green} BLUE: ${blue}`);
        
        console.log(`Enviando peticion a: ${API_SERVER}/addPostFilterRecord/`)
        axios.post(`${API_SERVER}/addPostFilterRecord/`, {
            red: red,
            green: green,
            blue: blue
        })
        .then(res => {
            console.log(res.data);
        })
        .catch(error => {
            console.log(`Enviando peticion a: ${API_SERVER}/addPostFilterRecord/ fallo: `,error);
        });
    }else if(line.includes(HUMIDITY)){
        const val = line.replace(HUMIDITY,"").replace(" ","");
        console.log(`Enviando peticion a: ${API_SERVER}/addHumidityRecord/`)
        axios.post(`${API_SERVER}/addHumidityRecord/`, {
            value: parseFloat(val)
        })
        .then(res => {
            console.log(res.data);
        })
        .catch(error => {
            console.log(`Enviando peticion a: ${API_SERVER}/addHumidityRecord/ fallo: `,error);
        });
    }else{
        console.log("Unrecognized Command: ",line);
    }
});
