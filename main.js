const {app, BrowserWindow} = require('electron');

let mainWindow;

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 1200, height: 800});
  mainWindow.loadURL('file://' + __dirname + '/window.html');
});
