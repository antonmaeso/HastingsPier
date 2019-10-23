import * as fr from "./app/core/util/FileLoader";
const url = require("url");
const path = require("path");
// const os = require("os");
import logo from "./app/core/assets/Ant.png";
const iconpath = path.join(__dirname + "\\" + logo);

import { app, BrowserWindow, ipcMain, Menu, nativeImage, Tray } from "electron";
import { IpcMainRouting } from "./app/core/util/IpcMainRouting";
import { Logger } from "./app/core/util/Logger";
import { NotifyRouting } from "./app/core/util/NotifyRouting";
import { WindowControl } from "./app/core/util/WindowManager";

export let mainWindowId: number;
const Path = app.getAppPath();
const logger = new Logger(Path + "\\log.log");
export const control = new WindowControl(iconpath, logger);
const NR = new NotifyRouting();

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


export function balloon(displayTitle: string, contents: string, other?: any) {
  try {
    appIcon.displayBalloon({ title: displayTitle, content: contents });
    lastBalloonMessage = contents;
  } catch (Exception) {
    appIcon.displayBalloon({ title: "Exception", content: Exception });
  }
}

// create static util classes

ipcMain.on("apps", (event: any, value: any) => {
  const appManefest = path.join(path.resolve() + "/dist", "/HastingsPier.json");

  let config: string | boolean = false;
  while (config === false) {
    config = fr.readFile(appManefest);
    if (config === false) {
      fr.createFile(appManefest, '{"apps":[{"appName":"TheAppFinderGeneral"}]}');
    }
  }
  control.getWindow(mainWindowId).webContents.send("appsResponse", config);
});

// to request a new window open
ipcMain.on("WindowControl", (event: any, value: any) => {
  const toReturn = control.route(value);
  return toReturn;
});

ipcMain.on("NewWindow", (event: any, value: any) => {
  let newWindow: number;
  newWindow = control.createNewWindow({
    frame: true,
    height: 600,
    icon: iconpath,
    minHeight: 300,
    minWidth: 300,
    webPreferences: {
      nodeIntegration: true
    },
    width: 800
  });
  control.getWindow(newWindow).show();
  control.getWindow(newWindow).loadURL(value);
  control
    .getWindow(mainWindowId)
    .webContents.send("webpageLauncher", newWindow);
});

