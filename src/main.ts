import * as fr from "./app/core/util/DataHandler/FileLoader";
const url = require("url");
const path = require("path");
// const os = require("os");
import logo from "./app/core/assets/Ant.png";
const iconpath = path.join(__dirname + "\\" + logo);

import { app, BrowserWindow, ipcMain, Menu, nativeImage, Tray, BrowserView, Rectangle } from "electron";
import { IpcMainRouting } from "./app/core/util/IpcMainRouting";
import { Logger } from "./app/core/util/Logger";
import { NotifyRouting } from "./app/core/util/NotifyRouting";
import { WindowControl } from "./app/core/util/WindowManager";
import { ICRUD } from "./app/core/util/DataHandler/ICRUD";
import {
  DataHandler,
  IFileOperations
} from "./app/core/util/DataHandler/DataHandler";
import { any } from "prop-types";

export let mainWindowId: number;
const Path = app.getAppPath();
const logger = new Logger(Path + "\\log.log");
export const control = new WindowControl(iconpath, logger);
const NR = new NotifyRouting();

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
        webviewTag: true
      },
      width: 800
    },
    "index.html"
  );

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
  appIcon = new Tray(
    nativeImage.createFromPath(iconpath).resize({ width: 16, height: 16 })
  );

  const contextMenu = Menu.buildFromTemplate([
    {
      click() {
        control.getWindow(mainWindowId).show();
      },
      label: "Show"
    },
    {
      label: "Quit",
      click() {
        app.quit();
      }
    },
    {
      label: "Last message",
      click() {
        balloon("Last message", lastBalloonMessage);
      }
    }
  ]);

  appIcon.setContextMenu(contextMenu);
  appIcon.setToolTip("Hastings Pier");
  appIcon.on("double-click", () => {
    control.getWindow(mainWindowId).show();
  });
  appIcon.on("balloon-click", () => {
    control.getWindow(mainWindowId).show();
  });
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
  let file: IFileOperations = DataHandler.createDataHandler();
  const appManefest = DataHandler.projectDist + "/HastingsPier.json";
  let config: string | boolean = false;
  config = file.readOrCreateThenRead(
    appManefest,
    '{"apps":[{"appName":"TheAppFinderGeneral"}]}'
  );
  control.getWindow(mainWindowId).webContents.send("appsResponse", config);
});

// to request a new window open
ipcMain.on(
  "WindowControl",
  (event: any, value: any, responseTarget: string) => {
    const toReturn = control.route(value);
    return toReturn;
  }
);

// ipcMain.on("WindowControl", (event: any, arg: any, responseTarget: string) => {
//   new Promise((resolve, reject) => {
//     const response = control.route(arg);
//     if (response !== undefined) {
//       resolve(response);
//     } else {
//       reject(undefined);
//     }
//   }).then((res) => {
//     // console.log("I was called successfully");
//     // console.log(res);
//     if (responseTarget !== undefined && responseTarget !== null) {
//       let WindowId = mainWindowId;
//       if (arg.windowId !== undefined && arg.windowId !== null) {
//         WindowId = arg.windowId;
//       }
//       control.getWindow(WindowId).webContents.send(responseTarget, res);
//     }
//   }).catch((res) => {
//     // tslint:disable: no-console
//     console.log("I was not called successfully");
//     console.log(res);
//     console.log(arg.target);
//     // console.log(arg.data);
//   });
// });

ipcMain.on("CallMe", () => {
  control.getWindow(mainWindowId).webContents.send("CallMe");
});

// map of browser views. Key is the app name in the view. Value is the view
const activeViews = new Map<string, BrowserView>();
ipcMain.on("CreateBrowserView", (event: any, value: any) => {
  const Src = value.src;
  const viewApplication = value.viewApplication;
  const view = new BrowserView();
  control.getWindow(mainWindowId).setBrowserView(view);
  const bound: Rectangle = { x: value.x, y: value.y, width: value.width, height: value.height };
  view.setAutoResize({ width: true, height: true, horizontal: false, vertical: false });
  view.setBounds(bound);
  view.webContents.loadURL(Src);

  // add to dictionary
  activeViews.set(viewApplication, view);

  // recentView.webContents.executeJavaScript()
});

ipcMain.on("CloseBrowserView", (event: any, value: any) => {
  const viewApplication = value.viewApplication;
  activeViews.get(viewApplication).destroy(); // currently only way to get rid of view
  activeViews.delete(viewApplication);
});

ipcMain.on("ShowBrowserView", (event: any, value: any) => {
  const viewApplication = value.viewApplication;
  let bound: Rectangle;
  if (value.x !== null && value.x !== undefined &&
    value.y !== null && value.y !== undefined &&
    value.width !== null && value.width !== undefined &&
    value.height !== null && value.height !== undefined) {
    bound = { x: value.x, y: value.y, width: value.width, height: value.height };
  } else {
    const bounding = document.getElementsByClassName("applicationWindow active")[0].getBoundingClientRect();
    bound = { x: bounding.left, y: bounding.top, height: bounding.height, width: bounding.width };
  }
  const viewToShow = activeViews.get(viewApplication);
  viewToShow.setBounds(bound); // to show, move it back on the screen
  // maybe make views stored in objects containing the last location they were shown?
});

const hideView = (view: BrowserView) => {
  view.setBounds({ x: 3000, y: 3000, height: 10, width: 10 });
};

ipcMain.on("HideBrowserView", (event: any, value: any) => {
  const viewApplication = value.viewApplication;

  const viewToHide = activeViews.get(viewApplication);
  hideView(viewToHide); // to hide, move it off the screen
});

ipcMain.on("HideAllBrowserView", () => {
  // loop through all views and hide them
  Array.from(activeViews.keys()).forEach((key) => {
    hideView(activeViews.get(key));
  });
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
