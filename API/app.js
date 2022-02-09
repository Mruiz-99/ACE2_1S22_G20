const express = require('express');
const app = express();
const api = require('./api');
const port = 7000;

app.use(express.json());

app.listen(port, () => {
    console.log(`IoT API is running on port ${port}`);
});

app.get('/getTempRecords/Casa/',api.getTempRecordsCasa);
app.get('/getTempRecords/Pozo/',api.getTempRecordsPozo);

