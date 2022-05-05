const bluetooth = require('bluetooth');

const btconn = new bluetooth.DeviceINQ();
      btconn.listPairedDevices(console.log);