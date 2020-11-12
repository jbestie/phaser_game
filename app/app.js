const {app, BrowserWindow} = require('electron');
const path = require('path')

let mainWindow = null;
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            worldSafeExecuteJavaScript: true,
            contextIsolation: true,
            nodeIntegration: true
        },
        width: 824,
        height: 650,
        resizable: false
    });

    mainWindow.setMenuBarVisibility(false);
    mainWindow.webContents.loadFile('app/index.html').then(() => {console.log('loaded')});

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // // Open the DevTools.
    // mainWindow.webContents.openDevTools()
});
