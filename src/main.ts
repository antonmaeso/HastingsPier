import { readJsonFile } from "./app/core/util/FileLoader";
const url = require("url");
const path = require("path");
// const os = require("os");
import logo from "./app/core/assets/Ant.png";
const iconpath = path.join(__dirname + "\\" + logo);

import { app, BrowserWindow, ipcMain, Menu, nativeImage, Tray } from "electron";
import { Logger } from "./app/core/Util/Logger";
import { WindowControl } from "./app/core/Util/WindowManager";
import { PersistantStore } from "./app/core/util/PersistantStorage";

let mainWindowId: number;
const Path = app.getAppPath();
const logger = new Logger(Path + "\\log.log");
const store = new PersistantStore(logger);
const control = new WindowControl(iconpath, logger);

const createWindow = () => {
  mainWindowId = control.createNewWindow({
    frame: false,
    height: 600,
    icon: iconpath,
    minHeight: 300,
    minWidth: 300,
    webPreferences: {
      nodeIntegration: true,
    },
    width: 800,
  }, "index.html");


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
  if (control.getWindow(mainWindowId) === null) {
    createWindow();
  }
});

// app tray
let appIcon: Tray = null;
let lastBalloonMessage = "";
const createTray = () => {
  appIcon = new Tray(nativeImage.createFromPath(iconpath).resize({ width: 16, height: 16 }));

  const contextMenu = Menu.buildFromTemplate([{
    click() {
      control.getWindow(mainWindowId).show();
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
  appIcon.on("double-click", () => { control.getWindow(mainWindowId).show(); });
  appIcon.on("balloon-click", () => { control.getWindow(mainWindowId).show(); });
};


ipcMain.on("balloon", (event: any, arg: any) => {
  balloon(arg.title, arg.contents, arg.other);
});
function balloon(displayTitle: string, contents: string, other?: any) {
  try {
    appIcon.displayBalloon({ title: displayTitle, content: contents });
    lastBalloonMessage = contents;
  } catch (Exception) {
    appIcon.displayBalloon({ title: "Exception", content: Exception });
  }
}

// create static util classes

ipcMain.on("apps", (event: any, value: any) => {
  const config = readJsonFile();
  control.getWindow(mainWindowId).webContents.send("appsResponse", config);
});

// ipc main routing to util classes

// ipc routing for app bar notifications
ipcMain.on("AppBarNotify", (event: any, value: any) => {
  control.getWindow(mainWindowId).webContents.send("notify" + value.App, value.Notification);
});

// ipc routing for application pane
ipcMain.on("AppBar", (event: any, value: any) => {
  control.getWindow(mainWindowId).webContents.send("AppBar", value);
});

// ipc routing to change Title
ipcMain.on("menuTitle", (event: any, value: any) => {
  let windowId = mainWindowId;
  if (value.WindowId !== undefined && value.WindowId !== null) {
    windowId = value.WindowId;
  }
  control.getWindow(windowId).webContents.send("menuTitle", value.Title);

});

// to choose Active Application
ipcMain.on("activeApplication", (event: any, value: any) => {
  control.getWindow(mainWindowId).webContents.send("activeApplication", value.Active);
});
