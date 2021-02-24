// Modules to control application life and create native browser window
require("update-electron-app")({
  logger: require("electron-log"),
});

const { app, BrowserWindow } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const glob = require("glob");

const debug = /--debug/.test(process.argv[2]);
// class AppUpdater {
//   constructor() {
//     autoUpdater.checkForUpdatesAndNotify();
//   }
// }
let mainWindow = null;

function initialize() {
  makeSingleInstance();

  loadMainProcess();

  function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 1200,
      minWidth: 700,
      height: 840,
      title: app.getName(),
      webPreferences: {
        nodeIntegration: true,
      },
    });

    // and load the index.html of the app.
    mainWindow.loadFile("app/index.html");
    mainWindow.on("closed", () => {
      mainWindow = null;
    });

    // Launch fullscreen with DevTools open, usage: npm run debug
    if (debug) {
      mainWindow.webContents.openDevTools();
      mainWindow.maximize();
      require("devtron").install();
    }

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
    // new AppUpdater();
  }

  app.on("ready", () => {
    createWindow();
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
  if (process.mas) return;

  app.requestSingleInstanceLock();

  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Require each JS file in the main-process dir
function loadMainProcess() {
  const files = glob.sync(path.join(__dirname, "main-process/**/*.js"));
  files.forEach((file) => {
    require(file);
  });
}

initialize();
