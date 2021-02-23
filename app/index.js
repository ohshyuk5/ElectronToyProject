// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Menu, Tray } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");

class AppUpdater {
  constructor() {
    autoUpdater.checkForUpdatesAndNotify();
  }
}

ipcMain.on("put-in-tray", (event) => {
  const iconName =
    process.platform === "win32" ? "windows-icon.png" : "iconTemplate.png";
  const iconPath = path.join(__dirname, iconName);
  appIcon = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Remove",
      click: () => {
        event.sender.send("tray-removed");
      },
    },
  ]);

  appIcon.setToolTip("Electron Demo in the tray.");
  appIcon.setContextMenu(contextMenu);
});

ipcMain.on("remove-tray", () => {
  appIcon.destroy();
});

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1080,
    minWidth: 680,
    height: 840,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("app/index.html");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  new AppUpdater();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
  if (appIcon) appIcon.destroy();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.