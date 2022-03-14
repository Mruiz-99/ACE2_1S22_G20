const express = require('express');
const cors = require('cors');
const app = express();
const api = require('./api');
const port = 7000;

app.use(cors());
app.use(express.json());
app.listen(port, () => {
    console.log(`IoT API is running on port ${port}`);
});

// Getters
app.get('/getDistanceRecords/',api.getDistanceRecords);
app.get('/getPrefilterRecords/',api.getPreFilterRecords);
app.get('/getPostfilterRecords/',api.getPostFilterRecords);
app.get('/getHumidityRecords/',api.getHumidityRecords);

app.get('/getDistanceRecords/GraphInit/',api.getDistanceRecordsGL);
app.get('/getPrefilterRecords/GraphInit/',api.getPreFilterRecordsGL);
app.get('/getPostfilterRecords/GraphInit/',api.getPostFilterRecordsGL);
app.get('/getHumidityRecords/GraphInit/',api.getHumidityRecordsGL);

// Posters
app.post('/addDistanceRecord/', api.addDistanceRecord);
app.post('/addPreFilterRecord/', api.addPreFilterRecord);
app.post('/addPostFilterRecord/', api.addPostFilterRecord);
app.post('/addHumidityRecord/', api.addHumidityRecord);

