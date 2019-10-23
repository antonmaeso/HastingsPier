import { ipcMain } from "electron";
import { balloon, control, mainWindowId } from "../../../main";

export class NotifyRouting {

    constructor() {
        this.initaliseListeners();
    }

    public initaliseListeners() {
        ipcMain.on("balloon", (event: any, arg: any) => {
            balloon(arg.title, arg.contents, arg.other);
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
            let windowId = mainWindowId;
            if (value.WindowId !== undefined && value.WindowId !== null) {
                windowId = value.WindowId;
            }
            control.getWindow(windowId).webContents.send("activeApplication", value.Active);
        });
    }
}
