import { readJsonFile } from "./app/core/util/FileLoader";
const url = require("url");
const path = require("path");
// const os = require("os");
import logo from "./app/core/assets/Ant.png";

import { app, BrowserWindow, ipcMain, Tray, nativeImage, Menu } from "electron";

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

  createTray();

  // BrowserWindow.addDevToolsExtension(
  //   path.join(os.homedir(), 
  //  '/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.2.0_0')
  // )
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

//app tray
let appIcon: Tray = null;
let lastBalloonMessage = "";
const createTray = () => {
  appIcon = new Tray(nativeImage.createFromPath( path.join(__dirname +"\\"+ logo)).resize({ width: 16, height: 16 }));

  const contextMenu = Menu.buildFromTemplate([{
    click() {
      window.show();
    },
    label: "Show",
  },
  {
    label: "Quit",
    click() {
      app.quit();
    },
  },
  {
    label: "Last message",
    click() {
      balloon("Last message", lastBalloonMessage);
    },
  },
  ]);

  appIcon.setContextMenu(contextMenu);
  appIcon.setToolTip("Hastings Pier");
  appIcon.on("double-click", () => { window.show(); });
  appIcon.on("balloon-click", () => { window.show(); });
};

function balloon(displayTitle: string, contents: string) {
  try {
    appIcon.displayBalloon({ title: displayTitle, content: contents });
    lastBalloonMessage = contents;
  } catch (Exception) {
    appIcon.displayBalloon({ title: "Exception", content: Exception });
  }
}


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

//ipc routing for application pane
ipcMain.on("AppBar", (event:any, value: any) => {
  window.webContents.send("AppBar", value);
})

