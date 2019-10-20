import { readJsonFile } from "./app/core/util/FileLoader";
const url = require("url");
const path = require("path");

import { app, BrowserWindow, ipcMain } from "electron";

let window: BrowserWindow | null;

const createWindow = () => {
  window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    width: 800,
    height: 600,
    minHeight: 300,
    minWidth: 300
  });

  window.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  window.on("closed", () => {
    window = null;
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (window === null) {
    createWindow();
  }
});

// create static util classes
const config = readJsonFile();
ipcMain.on("apps", () => {
  window.webContents.send(config);
});

// ipc main routing to util classes

// ipc routing for testing
ipcMain.on("notify", (event: any, value: any) => {
  window.webContents.send("notify" + value.App, value);
});
