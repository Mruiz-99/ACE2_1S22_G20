const express = require('express');
const app = express();
const api = require('./api');
const port = 7000;

app.use(express.json());
app.listen(port, () => {
    console.log(`IoT API is running on port ${port}`);
});

// Getters
app.get('/getTempRecords/Casa/',api.getTempRecordsCasa);
app.get('/getTempRecords/Pozo/',api.getTempRecordsPozo);
app.get('/getLumenRecords/',api.getLumenRecords);
app.get('/getHumidityRecords/',api.getHumidityRecords);
app.get('/getCO2Records/',api.getCO2Records);

app.get('/getTempRecords/Casa/GraphInit/',api.getTempRecordsCasaGL);
app.get('/getTempRecords/Pozo/GraphInit/',api.getTempRecordsPozoGL);
app.get('/getLumenRecords/GraphInit/',api.getLumenRecordsGL);
app.get('/getHumidityRecords/GraphInit/',api.getHumidityRecordsGL);
app.get('/getCO2Records/GraphInit/',api.getCO2RecordsGL);

// Posters
app.post('/addTempRecord/Casa/', api.addTempRecordCasa);
app.post('/addTempRecord/Pozo/', api.addTempRecordPozo);
app.post('/addLumenRecord/', api.addLumenRecord);
app.post('/addCO2Record/', api.addCO2Record);
app.post('/addHumidityRecord/', api.addHumidityRecord);

