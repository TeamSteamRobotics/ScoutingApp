const {app, BrowserWindow} = require('electron');
require('electron-middle-sass');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({width: 800, height: 600, frame: false, fullscreen: false})

    mainWindow.loadFile("index.html");

    mainWindow.on("closed", function() {
        mainWindow = null;
    })
}

app.on("ready", createWindow);

app.on("window-all-closed", function() {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function() {
    if (mainWindow == null) {
        createWindow();
    }
});
