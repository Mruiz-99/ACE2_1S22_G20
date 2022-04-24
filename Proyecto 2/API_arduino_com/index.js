

// COM attached to bluetooth
const ARDUINO_COM ="COM2";

// Command Constants
const TEMPERATURE = "TEMP";
const METANE = "METANO";

const serialPort = require('serialport');
var createInterface = require('readline').createInterface;
var arduino = new serialPort(ARDUINO_COM, {baudRate: 9600});


function sendCommand(command){
    arduino.write(command, function (err){
        if(err){
            return console.log("Error sending command to arduino...");
        }
    });
}

var lineReader = createInterface({
    input: arduino
});

lineReader.on('line', (line) => {
    if(line.includes(TEMPERATURE)){
        const val = line.replace(TEMPERATURE,"").replace(" ","");
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
    }else if(line.includes(METANE)){
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
    }else{
        console.log("Unrecognized Command: ",line);
    }
});



