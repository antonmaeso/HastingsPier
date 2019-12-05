import * as fr from "./app/core/util/DataHandler/FileLoader";
const url = require("url");
const path = require("path");
// const os = require("os");
import logo from "./app/core/assets/Ant.png";
const iconpath = path.join(__dirname + "\\" + logo);

import { app, ipcMain, Menu, nativeImage, Tray } from "electron";
import { BrowserViewControl } from "./app/core/util/BrowserViewControl";
import {
  DataHandler,
  IFileOperations,
} from "./app/core/util/DataHandler/DataHandler";
import { ICRUD } from "./app/core/util/DataHandler/ICRUD";
import { IpcMainRouting } from "./app/core/util/IpcMainRouting";
import { Logger } from "./app/core/util/Logger";
import { NotifyRouting } from "./app/core/util/NotifyRouting";
import { WindowControl } from "./app/core/util/WindowManager";

export let mainWindowId: number;
const Path = app.getAppPath();
const logger = new Logger(Path + "\\log.log");
export const control = new WindowControl(iconpath, logger);
const NR = new NotifyRouting();
const IpcMain = new IpcMainRouting();
const BV = new BrowserViewControl();

const createWindow = () => {
  mainWindowId = control.createNewWindow(
    {
      frame: false,
      height: 600,
      icon: iconpath,
      minHeight: 300,
      minWidth: 300,
      webPreferences: {
        nodeIntegration: true,
        webviewTag: true,
      },
      width: 800,
    },
    "index.html",
  );

  createTray();

  // BrowserWindow.addDevToolsExtension(
  //   path.join(os.homedir(),
  //  '/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.2.1_0')
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
let balloonSource = "";
let balloonWindow = mainWindowId;
const createTray = () => {
  appIcon = new Tray(
    nativeImage.createFromPath(iconpath).resize({ width: 16, height: 16 }),
  );

  const contextMenu = Menu.buildFromTemplate([
    {
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
        balloon("Last message", lastBalloonMessage, balloonSource, balloonWindow);
      },
    },
  ]);

  appIcon.setContextMenu(contextMenu);
  appIcon.setToolTip("Hastings Pier");
  appIcon.on("double-click", () => {
    control.getWindow(mainWindowId).show();
  });
  appIcon.on("balloon-click", () => {
    if (balloonSource !== "" && balloonSource !== null && balloonSource !== undefined) {
      control.getWindow(mainWindowId).show();
      // TODO: SetActive doesnt set the title so clicking the balloon doesnt change the title. For now set to App Key
      SetActive(balloonSource, balloonWindow);
      NR.MenuTitle(balloonSource);
    } else {
      control.getWindow(mainWindowId).show();
    }
  });
};

export function balloon(displayTitle: string, contents: string, Source?: any, WindowId?: number) {
  try {
    appIcon.displayBalloon({ title: displayTitle, content: contents });
    lastBalloonMessage = contents;
    balloonSource = Source;
    balloonWindow = WindowId;
  } catch (Exception) {
    appIcon.displayBalloon({ title: "Exception", content: Exception });
  }
}

// to request a new window open
ipcMain.on(
  "WindowControl",
  (event: any, value: any, responseTarget: string) => {
    const toReturn = control.route(value);
    return toReturn;
  },
);

// --------- Notify Routing ---------
// to choose Active Application
ipcMain.on("activeApplication", (event: any, value: any) => {
  SetActive(value.Active, value.WindowId);
});

function SetActive(App: string, WindowId?: number) {
  NR.setActiveApplication(App);
  let windowId = mainWindowId;
  if (WindowId !== undefined && WindowId !== null) {
    windowId = WindowId;
  }
  NR.activeApp(App, windowId);
}


// ---------- Dev experiments ------------
ipcMain.on("apps", (event: any, value: any) => {
  const file: IFileOperations = DataHandler.createDataHandler();
  const appManefest = DataHandler.projectDist + "/HastingsPier.json";
  let config: string | boolean = false;
  config = file.readOrCreateThenRead(
    appManefest,
    '{"apps":[{"appName":"TheAppFinderGeneral"}]}',
  );
  control.getWindow(mainWindowId).webContents.send("appsResponse", config);
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
      nodeIntegration: true,
    },
    width: 800,
  });
  control.getWindow(newWindow).show();
  control.getWindow(newWindow).loadURL(value);
  control
    .getWindow(mainWindowId)
    .webContents.send("webpageLauncher", newWindow);
});


