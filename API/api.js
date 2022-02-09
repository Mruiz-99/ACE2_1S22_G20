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

const getTempRecords = async (request, response) => {
    response.status(200).json(fakeValue);
};

module.exports = {
    getTempRecords
};